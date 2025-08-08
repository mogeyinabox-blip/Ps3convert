const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

document.getElementById('convertBtn').addEventListener('click', async () => {
  const uploader = document.getElementById('uploader');
  const status = document.getElementById('status');
  const downloadLink = document.getElementById('downloadLink');

  if (uploader.files.length === 0) {
    alert('Please select a video file.');
    return;
  }

  const file = uploader.files[0];
  status.innerText = 'Loading FFmpeg...';

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  status.innerText = 'Uploading and converting...';

  ffmpeg.FS('writeFile', file.name, await fetchFile(file));

  const outputName = 'output_ps3.mp4';

  await ffmpeg.run(
    '-i', file.name,
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', 'faststart',
    outputName
  );

  const data = ffmpeg.FS('readFile', outputName);
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  const videoUrl = URL.createObjectURL(videoBlob);

  downloadLink.href = videoUrl;
  downloadLink.download = outputName;
  downloadLink.innerText = 'Download Converted Video';
  downloadLink.style.display = 'block';

  status.innerText = 'Conversion complete!';
});
