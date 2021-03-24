1. Replace webcam "Stop" with "Exit"
2. Base Webcam button with you Android camera, the border bottom should be black, and button was white
3. have query parameter where you can place either image url or base64 string and upon page load, it will detect the face from the query.
4. Based from #3, have Open Graph Preview. From what I gathered, needs to be done serverside, hosting on vercel seems to be easiest solution. On the server the image should be ported to canvas, then add the box boundaries inside canvas, then add padding to make sure it is not cropped

5. have filter/sorting functions on table
   Face: ACS DECS Revert
   Age: number Greatest Least Revert
   Gender: Male/Female Revert
   Multicultural: Alphabetical Reverse Revert

6. Clarifai maximum image size is 3.6MB. Compress url that has over 3.6MB https://media.defense.gov/2014/Sep/08/2000943675/-1/-1/0/140907-F-WE773-015.JPG
7. When removing demograhicNode use translate effect. Get removing target top position > remove observers > target pointer events none > translate
8. Predict image size on resizing between 1300px. Layout thrashing.
9. Have table of contents on the right side. On mobile either have a nav icon on the viewport's bottom right, or have a nav icon on item utility panel.

### Note

1. InputBox inner buttons are actually just divs, I can get away with this since those buttons are not meant to be focusable in the first place, this a scuffed version of Tagify or what StackOverflow uses and they follow the same behavior. This also prevents buttons to be actived inside form event, to clarify, when you press enter, it bubbles to the closest button and that button fires.
