import yt_dlp
import pandas as pd
from datetime import datetime

# ---------- CONFIGURATION ----------
CHANNEL_URL = "https://www.youtube.com/@Flowwj0/videos"
OUTPUT_FILE = "youtube_videos.csv"
# -----------------------------------

def fetch_video_metadata(channel_url):
    ydl_opts = {
        "quiet": True,         # Suppress console spam
        "skip_download": True, # Don't download videos
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(channel_url, download=False)
        return info.get("entries", [])

def process_videos(entries):
    videos_data = []
    for video in entries:
        # Format upload date as YYYY-MM-DD
        raw_date = video.get("upload_date")
        formatted_date = (
            datetime.strptime(raw_date, "%Y%m%d").strftime("%Y-%m-%d")
            if raw_date else ""
        )
        videos_data.append({
            "Title": video.get("title"),
            "Duration": video.get("duration_string") or "",  # e.g., 32:41
            "Upload Date": formatted_date,
            "Views": f"{video.get('view_count', 0):,}",       # e.g., 1,234
            "URL": video.get("webpage_url")
        })
    return pd.DataFrame(videos_data)

def main():
    print("Fetching video metadata (this may take a while)...")
    entries = fetch_video_metadata(CHANNEL_URL)
    print(f"Found {len(entries)} videos.")

    df = process_videos(entries)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"✅ Metadata exported to '{OUTPUT_FILE}'")

if __name__ == "__main__":
    main()
