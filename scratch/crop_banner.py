from PIL import Image

def crop_banner_fixed():
    image_path = "assets/hero-banner-v3.png"
    img = Image.open(image_path)
    
    # Slice a horizontal block containing the centered card (y from 290 to 724)
    # This matches the horizontal card dimensions perfectly
    cropped_img = img.crop((0, 290, 1024, 724))
    cropped_img.save(image_path)
    print("Successfully cropped image vertically to 1024x434 (wide aspect ratio).")

if __name__ == "__main__":
    crop_banner_fixed()
