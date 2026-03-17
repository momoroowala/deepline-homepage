#!/usr/bin/env python3
"""
Performance evaluator for DeepLine homepage.
Measures file sizes, CSS/JS structure, and computes a composite score.
DO NOT MODIFY after experiment starts.
"""
import os
import re
import json
import sys
from datetime import datetime

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

def count_inline_css_lines(html_path):
    """Count lines inside <style> blocks in HTML."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    total = 0
    for match in re.finditer(r'<style[^>]*>(.*?)</style>', content, re.DOTALL):
        total += match.group(1).count('\n')
    return total

def count_inline_js_lines(html_path):
    """Count lines inside <script> blocks (excluding JSON-LD) in HTML."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    total = 0
    for match in re.finditer(r'<script(?![^>]*application/ld\+json)[^>]*>(.*?)</script>', content, re.DOTALL):
        body = match.group(1).strip()
        if body:
            total += body.count('\n') + 1
    return total

def check_font_deferred(html_path):
    """Check if Google Fonts is loaded with defer pattern."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Check for media="print" onload pattern
    return 'fonts.googleapis.com' in content and ('media="print"' in content or 'media=print' in content)

def check_css_deferred(html_path):
    """Check if styles.css is loaded with defer pattern."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Look for styles.css with media="print" onload pattern
    pattern = r'<link[^>]*href=["\']styles\.css["\'][^>]*media=["\']print["\']'
    pattern2 = r'<link[^>]*media=["\']print["\'][^>]*href=["\']styles\.css["\']'
    return bool(re.search(pattern, content)) or bool(re.search(pattern2, content))

def check_js_externalized(html_path):
    """Check if JS is loaded from external file with defer."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return 'src="scripts.js"' in content and 'defer' in content

def check_images_lazy(html_path):
    """Check if images have lazy loading."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    has_lazy = 'loading="lazy"' in content
    has_dimensions = 'width="' in content and 'height="' in content
    return has_lazy, has_dimensions

def check_preconnect(html_path):
    """Check for preconnect hints."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return 'rel="preconnect"' in content

def check_reduced_motion(css_path):
    """Check for prefers-reduced-motion."""
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return 'prefers-reduced-motion' in content

def evaluate():
    html_path = os.path.join(REPO, 'index.html')
    css_path = os.path.join(REPO, 'styles.css')
    js_path = os.path.join(REPO, 'scripts.js')

    # File sizes
    html_size_kb = os.path.getsize(html_path) / 1024
    css_size_kb = os.path.getsize(css_path) / 1024 if os.path.exists(css_path) else 0
    js_size_kb = os.path.getsize(js_path) / 1024 if os.path.exists(js_path) else 0

    headshot_path = os.path.join(REPO, 'mo-headshot.png')
    logo_path = os.path.join(REPO, 'logo.png')
    img_size_kb = 0
    if os.path.exists(headshot_path):
        img_size_kb += os.path.getsize(headshot_path) / 1024
    if os.path.exists(logo_path):
        img_size_kb += os.path.getsize(logo_path) / 1024

    # Structural metrics
    inline_css = count_inline_css_lines(html_path)
    inline_js = count_inline_js_lines(html_path)
    font_deferred = check_font_deferred(html_path)
    css_deferred = check_css_deferred(html_path)
    js_external = check_js_externalized(html_path)
    lazy_img, img_dims = check_images_lazy(html_path)
    preconnect = check_preconnect(html_path)
    reduced_motion = check_reduced_motion(css_path)

    # Scoring (0-100)
    score = 0

    # HTML size: 25 points (270KB baseline → target <50KB)
    if html_size_kb <= 50:
        score += 25
    elif html_size_kb <= 80:
        score += 20
    elif html_size_kb <= 120:
        score += 15
    elif html_size_kb <= 180:
        score += 10
    elif html_size_kb <= 270:
        score += 5

    # Inline CSS: 20 points (1500 lines baseline → target <200)
    if inline_css <= 200:
        score += 20
    elif inline_css <= 400:
        score += 15
    elif inline_css <= 800:
        score += 10
    elif inline_css <= 1200:
        score += 5

    # CSS deferred: 10 points
    if css_deferred:
        score += 10

    # Font deferred: 5 points
    if font_deferred:
        score += 5

    # JS externalized: 10 points
    if js_external:
        score += 10

    # Inline JS minimal: 10 points
    if inline_js <= 15:
        score += 10
    elif inline_js <= 30:
        score += 7
    elif inline_js <= 80:
        score += 3

    # Image optimization: 10 points
    if lazy_img:
        score += 5
    if img_dims:
        score += 5

    # Resource hints: 5 points
    if preconnect:
        score += 5

    # Reduced motion: 5 points
    if reduced_motion:
        score += 5

    # Print results
    print(f"=== DeepLine Page Speed Evaluation ===")
    print(f"")
    print(f"FILE SIZES:")
    print(f"  HTML:       {html_size_kb:.1f} KB")
    print(f"  CSS:        {css_size_kb:.1f} KB")
    print(f"  JS:         {js_size_kb:.1f} KB")
    print(f"  Images:     {img_size_kb:.1f} KB")
    print(f"  Total:      {html_size_kb + css_size_kb + js_size_kb + img_size_kb:.1f} KB")
    print(f"")
    print(f"STRUCTURE:")
    print(f"  Inline CSS: {inline_css} lines {'[OK]' if inline_css <= 200 else '[X]'}")
    print(f"  Inline JS:  {inline_js} lines {'[OK]' if inline_js <= 15 else '[X]'}")
    print(f"")
    print(f"OPTIMIZATIONS:")
    print(f"  Font deferred:     {'[OK]' if font_deferred else '[X]'}")
    print(f"  CSS deferred:      {'[OK]' if css_deferred else '[X]'}")
    print(f"  JS externalized:   {'[OK]' if js_external else '[X]'}")
    print(f"  Lazy images:       {'[OK]' if lazy_img else '[X]'}")
    print(f"  Image dimensions:  {'[OK]' if img_dims else '[X]'}")
    print(f"  Preconnect hints:  {'[OK]' if preconnect else '[X]'}")
    print(f"  Reduced motion:    {'[OK]' if reduced_motion else '[X]'}")
    print(f"")
    print(f"score: {score}")

    # Write to dashboard JSON
    dashboard_data = {
        "timestamp": datetime.now().isoformat(),
        "score": score,
        "html_kb": round(html_size_kb, 1),
        "css_kb": round(css_size_kb, 1),
        "js_kb": round(js_size_kb, 1),
        "img_kb": round(img_size_kb, 1),
        "inline_css_lines": inline_css,
        "inline_js_lines": inline_js,
        "font_deferred": font_deferred,
        "css_deferred": css_deferred,
        "js_external": js_external,
        "lazy_images": lazy_img,
        "image_dimensions": img_dims,
        "preconnect": preconnect,
        "reduced_motion": reduced_motion
    }

    dashboard_path = os.path.join(REPO, '.autoresearch', 'engineering', 'page-speed', 'dashboard_data.json')

    # Append to history
    history_path = os.path.join(REPO, '.autoresearch', 'engineering', 'page-speed', 'history.json')
    history = []
    if os.path.exists(history_path):
        with open(history_path, 'r') as f:
            history = json.load(f)
    history.append(dashboard_data)
    with open(history_path, 'w') as f:
        json.dump(history, f, indent=2)

    with open(dashboard_path, 'w') as f:
        json.dump(dashboard_data, f, indent=2)

    return score

if __name__ == '__main__':
    score = evaluate()
    sys.exit(0 if score > 0 else 1)
