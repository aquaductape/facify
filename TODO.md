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
    2. Bing: https://www.bing.com/images/search?mediaurl=fakeurl
    3. Yahoo: https://images.search.yahoo.com/images/imgurl=[missing https]fakeurl
    4. Baidu: https://image.baidu.com/search/detail?objurl=fakeurl

https://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=post%20malone&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined&copyright=undefined&cs=3193737525,732819421&os=4058330613,1349250225&simid=4133321012,685446309&pn=0&rn=1&di=90750&ln=1459&fr=&fmq=1626907520133_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=0&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%253A%252F%252Fc-ssl.duitang.com%252Fuploads%252Fitem%252F201903%252F04%252F20190304174433_wpwjt.jpg%26refer%3Dhttp%253A%252F%252Fc-ssl.duitang.com%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Djpeg%3Fsec%3D1629499518%26t%3D930ea212ab12bdbe3318c3113566e8fe&rpstart=0&rpnum=0&adpicid=0&nojc=undefined&ctd=1626908007760^3_1905X981%1

### Note

1. InputBox inner buttons are actually just divs, I can get away with this since those buttons are not meant to be focusable in the first place, this a scuffed version of Tagify or what StackOverflow uses and they follow the same behavior. This also prevents buttons to be actived inside form event, to clarify, when you press enter, it bubbles to the closest button and that button fires.

### Report Bugs

1. on Chrome/Safari, the setting child translate resets parent scrollLeft value back to zero
