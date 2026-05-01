#!/usr/bin/env python3
"""
Scan all 482 Mushaf pages to detect Surah boundaries.
Detection method: look for a thin horizontal separator line that spans
nearly the full page width. This line always precedes Bismillah and marks
the start of a new Surah.
"""

import os
import sys
import json
import numpy as np
from PIL import Image

PAGES_DIR = "artifacts/mushaf/assets/pages"
TOTAL_PAGES = 482

def load_image_gray(page_num: int) -> np.ndarray:
    path = os.path.join(PAGES_DIR, f"p{page_num:03d}.jpg")
    img = Image.open(path).convert("L")  # grayscale
    return np.array(img, dtype=np.float32)

def detect_separator_line(arr: np.ndarray) -> bool:
    """
    Detect if this page contains a horizontal separator line.
    
    The separator line is a thin dark horizontal rule that spans
    nearly the full width of the page. It appears between Surahs,
    just above the Bismillah.
    
    Strategy:
    - For each row, compute what fraction of pixels are 'dark' (< threshold)
    - A separator line row will have a VERY high fraction of dark pixels
      (continuous dark line) compared to text rows (scattered dark pixels)
    - Also check that the line spans the full width (no wide gaps)
    """
    height, width = arr.shape
    
    # Only look in the middle/lower area of the page (top 10% is hizb header)
    # The separator can appear anywhere in the page body
    start_row = int(height * 0.08)
    end_row = int(height * 0.95)
    
    # Threshold for "dark" pixel
    dark_thresh = 80  # pixel value < 80 is considered dark
    
    # For each row, check if it's a separator line
    for y in range(start_row, end_row):
        row = arr[y]
        
        # Count dark pixels
        dark_pixels = np.sum(row < dark_thresh)
        dark_fraction = dark_pixels / width
        
        # A separator line needs to cover at least 75% of the width
        if dark_fraction < 0.75:
            continue
        
        # Additionally verify: the line is thin (next/prev rows are lighter)
        # Check that surrounding rows are NOT also fully dark (not text block)
        rows_to_check = []
        if y > start_row + 2:
            rows_to_check.extend([y - 2, y - 1])
        if y < end_row - 2:
            rows_to_check.extend([y + 1, y + 2])
        
        # Surrounding rows should be lighter (not a solid dark block)
        surrounding_dark = []
        for cy in rows_to_check:
            cdark = np.sum(arr[cy] < dark_thresh) / width
            surrounding_dark.append(cdark)
        
        if surrounding_dark:
            avg_surrounding = sum(surrounding_dark) / len(surrounding_dark)
            # The separator is thinner than text blocks - surrounding rows should be lighter
            # Require at least one surrounding row to be significantly lighter
            if avg_surrounding < 0.65:
                return True
    
    return False

def scan_all_pages():
    """Scan all 482 pages and return list of pages with separator lines."""
    pages_with_separator = []
    
    print(f"Scanning {TOTAL_PAGES} pages...")
    print("-" * 50)
    
    for page in range(1, TOTAL_PAGES + 1):
        try:
            arr = load_image_gray(page)
            has_sep = detect_separator_line(arr)
            if has_sep:
                pages_with_separator.append(page)
                print(f"  ✓ Page {page:3d}: SEPARATOR DETECTED")
        except Exception as e:
            print(f"  ✗ Page {page:3d}: ERROR - {e}")
        
        if page % 50 == 0:
            print(f"  ... processed {page}/{TOTAL_PAGES}")
    
    return pages_with_separator

if __name__ == "__main__":
    pages = scan_all_pages()
    print("\n" + "=" * 50)
    print(f"TOTAL PAGES WITH SURAH SEPARATORS: {len(pages)}")
    print("Pages:", pages)
    
    # Save to JSON for further processing
    with open("scripts/separator_pages.json", "w") as f:
        json.dump({"separator_pages": pages, "count": len(pages)}, f, indent=2)
    print("\nResults saved to scripts/separator_pages.json")
