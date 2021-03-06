1. Replace webcam "Stop" with "Exit"
2. Base Webcam button with you Android camera, the border bottom should be black, and button was white
3. have query parameter where you can place either image url or base64 string and upon page load, it will detect the face from the query.
4. Based from #3, have Open Graph Preview. From what I gathered, needs to be done serverside, hosting on vercel seems to be easiest solution. On the server the image should be ported to canvas, then add the box boundaries inside canvas, then add padding to make sure it is not cropped

5. have filter/sorting functions on table
   Face: ACS DECS Revert
   Age: number Greatest Least Revert
   Gender: Male/Female Revert
   Multicultural: Alphabetical Reverse Revert
