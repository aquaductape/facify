1. have query parameter where you can place either image url or base64 string and upon page load, it will detect the face from the query.
2. Based from #3, have Open Graph Preview. From what I gathered, needs to be done serverside, hosting on vercel seems to be easiest solution. On the server the image should be ported to canvas, then add the box boundaries inside canvas, then add padding to make sure it is not cropped

3. Predict image size on resizing between 1300px. Layout thrashing.
4. Have table of contents on the right side. On mobile either have a nav icon on the viewport's bottom right, or have a nav icon on item utility panel.
5. Instead of click me, use "Try Me"
6. ClassifyBtns onFocusOut
7. shows same landingpage translate issue in Safari
8. Deal with no faces. Currently it will crash.
9. Focus inside Classify Area when opened
10. Refactore file and data naming consistency.
11. Better TextInput feedback on URL validation, have protocol preprend automatically when typing in text input (issues: dealing with pressing spacebar when only protocol is present, when backspacing, protocol will always be there when it shouldn't). use this as reference https://stackoverflow.com/a/68333175/8234457
12. Drag & Drop from top search engines image results. Use `decodeURIComponent`
    1. Google
       1. from image results: https://www.google.com/imgres?imgurl=fakeurl
       2. from image card preview: Not Possible. Unfornately there's no img url parameter only the site URL, I would have to use an API to grab the image in relation to the site URL.
       3. Issue, sometimes urls link to Facebook and those url's are not images.

### Note

1. InputBox inner buttons are actually just divs, I can get away with this since those buttons are not meant to be focusable in the first place, this a scuffed version of Tagify or what StackOverflow uses and they follow the same behavior. This also prevents buttons to be actived inside form event, to clarify, when you press enter, it bubbles to the closest button and that button fires.

### Report Bugs

1. on Chrome/Safari, the setting child translate resets parent scrollLeft value back to zero
