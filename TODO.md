1. have query parameter where you can place either image url or base64 string and upon page load, it will detect the face from the query.
2. Based from #3, have Open Graph Preview. From what I gathered, needs to be done serverside, hosting on vercel seems to be easiest solution. On the server the image should be ported to canvas, then add the box boundaries inside canvas, then add padding to make sure it is not cropped

3. Predict image size on resizing between 1300px. Layout thrashing.
4. Have table of contents on the right side. On mobile either have a nav icon on the viewport's bottom right, or have a nav icon on item utility panel.
5. Instead of click me, use "Try Me"
6. Loader jump to content
7. Webcam Camera
8. ClassifyBtns onFocusOut
9. shows same landingpage translate issue in Safari
10. When i tested all error items, the loader menu items weren't synced, and were at default state.
11. Deal with no faces. Currently it will crash.
12. Focus inside Classify Area when opened
13. Get rid of focus outline on containers (Loader Menu)

### Note

1. InputBox inner buttons are actually just divs, I can get away with this since those buttons are not meant to be focusable in the first place, this a scuffed version of Tagify or what StackOverflow uses and they follow the same behavior. This also prevents buttons to be actived inside form event, to clarify, when you press enter, it bubbles to the closest button and that button fires.

### Report Bugs

1. on Chrome/Safari, the setting child translate resets parent scrollLeft value back to zero
