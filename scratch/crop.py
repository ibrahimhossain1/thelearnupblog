from PIL import Image

# Path to the image
img_path = r"C:\Users\Faysal\.gemini\antigravity\brain\91957fd4-9267-43e5-aeb9-8a780bda58a2\media__1781097546810.png"

try:
    img = Image.open(img_path)
    width, height = img.size
    print(f"Image size: {width}x{height}")
    
    # Browser URL bar is at the very top, usually from y=0 to y=45
    # Let's crop the top part where the URL is
    crop_url = img.crop((0, 0, width, int(height * 0.15)))
    crop_url.save(r"C:\Users\Faysal\.gemini\antigravity\brain\91957fd4-9267-43e5-aeb9-8a780bda58a2\crop_browser_url.png")
    print("Cropped browser URL successfully!")
except Exception as e:
    print("Error:", e)
