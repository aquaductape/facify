/**
 * @jest-environment jsdom
 */
import { splitValueIntoUrlItems } from "../containers/UploadImageForm/TextInput/InputBoxInner/utils";
// @ts-ignore
// import { implSymbol } from "jsdom/lib/jsdom/living/generated/utils";
// import { writeFileSync, unlinkSync, rmdirSync } from "fs";

// const cache = ".my_cache";
// rmdirSync(`node_modules/${cache}`);
//
// const map: { [key: string]: string } = {};
//
// window.URL.createObjectURL = (blob) => {
//   const uuid = Math.random().toString(36).slice(2);
//   const path = `node_modules/${cache}/${uuid}.jpg`;
//   writeFileSync(path, blob[implSymbol]._buffer);
//   const url = `file://${path}`;
//   map[url] = path;
//   return url;
// };
// window.URL.revokeObjectURL = (url) => {
//   unlinkSync(map[url]);
//   delete map[url];
// };

describe("parse text URL input", () => {
  test("simple URL", () => {
    expect(
      splitValueIntoUrlItems({
        value:
          "https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png",
      }).map((item) => ({ name: item.name, url: item.content }))[0]
    ).toStrictEqual({
      url: "https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png",
      name: "Bliss_%28Windows_XP%29.png",
    });
  });

  test("invalid URLs", () => {
    expect(
      splitValueIntoUrlItems({
        value:
          "htps://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png bear pig.png www.hellword.com/landing.png",
      }).length
    ).toBe(0);
  });

  //  createObjectURL not supported by jsdom.  https://github.com/jsdom/jsdom/issues/1721
  // hacky workaround https://github.com/GMartigny/crop-browser/blob/master/test/_set-env.js

  // test("convert base64 image to objectURL", () => {
  //   expect(
  //     splitValueIntoUrlItems({
  //       value:
  //         "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=",
  //     })[0]
  //   ).toBe(true);
  // });

  test("clumped URLs", () => {
    expect(
      splitValueIntoUrlItems({
        value: `
          https://static.tvtropes.org/pmwiki/pub/images/aubrey_plaza.jpg

          https://cms.qz.com/wp-content/uploads/2018/10/Elon-Musks-1999-dream-is-being-realized.jpg?quality=75&strip=all&w=1200&h=900&crop=1https://ca-times.brightspotcdn.com/dims4/default/a7ccc15/2147483647/strip/true/crop/2048x1152+0+0/resize/840x473!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fd5%2Fb5%2Fa8bffb00214d8bd8149373c18a6a%2Fla-1467703026-snap-photoblob:http://localhost:3000/14334a11-fa1b-455b-8d92-3bcceaf5078chttps://cdn.cnn.com/cnnnext/dam/assets/200430105748-a380-flying-1-1-super-169.jpg
          
          https://i.imgur.com/zzJdv34.jpg
          `,
      }).map((item) => ({ name: item.name, url: item.content }))
    ).toStrictEqual([
      {
        url: "https://static.tvtropes.org/pmwiki/pub/images/aubrey_plaza.jpg",
        name: "aubrey_plaza.jpg",
      },
      {
        url: "https://cms.qz.com/wp-content/uploads/2018/10/Elon-Musks-1999-dream-is-being-realized.jpg?quality=75&strip=all&w=1200&h=900&crop=1",
        name: "Elon-Musks-1999-dream-is-being-realized.jpg",
      },
      {
        url: "https://ca-times.brightspotcdn.com/dims4/default/a7ccc15/2147483647/strip/true/crop/2048x1152+0+0/resize/840x473!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fd5%2Fb5%2Fa8bffb00214d8bd8149373c18a6a%2Fla-1467703026-snap-photo",
        name: "la-1467703026-snap-photo",
      },
      {
        url: "blob:http://localhost:3000/14334a11-fa1b-455b-8d92-3bcceaf5078c",
        name: "14334a11-fa1b-455b-8d92-3bcceaf5078c",
      },
      {
        url: "https://cdn.cnn.com/cnnnext/dam/assets/200430105748-a380-flying-1-1-super-169.jpg",
        name: "200430105748-a380-flying-1-1-super-169.jpg",
      },
      {
        url: "https://i.imgur.com/zzJdv34.jpg",
        name: "zzJdv34.jpg",
      },
    ]);
  });

  test("text that contain words and URLs", () => {
    expect(
      splitValueIntoUrlItems({
        value: `
        Hello everyone! Look at my cool array! Or watch my youtube video http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo, it's really good.

        const arr = [
          "foo",
          'https://cms.qz.com/wp-content/uploads/2018/10/Elon-Musks-1999-dream-is-being-realized.jpg?quality=75&strip=all&w=1200&h=900&crop=1',
          "www.bar.com/iam.jpg",
          "https://ca-times.brightspotcdn.com/dims4/default/a7ccc15/2147483647/strip/true/crop/2048x1152+0+0/resize/840x473!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fd5%2Fb5%2Fa8bffb00214d8bd8149373c18a6a%2Fla-1467703026-snap-photo",
          "https:lol.badlink/img.png",
          "https://i.imgur.com/zzJdv34.jpg",
        ];

        Hope you guys have a (good one)[https://images.squarespace-cdn.com/content/v1/55f009c8e4b079158f302bab/1447674317474-MGXBJ05SP7RPMWNPENSN/happy.jpg], and have fun!
        `,
      }).map((item) => ({ name: item.name, url: item.content }))
    ).toStrictEqual([
      {
        url: "https://img.youtube.com/vi/1p3vcRhsYGo/0.jpg",
        name: "1p3vcRhsYGo",
      },
      {
        url: "https://cms.qz.com/wp-content/uploads/2018/10/Elon-Musks-1999-dream-is-being-realized.jpg?quality=75&strip=all&w=1200&h=900&crop=1",
        name: "Elon-Musks-1999-dream-is-being-realized.jpg",
      },
      {
        url: "https://ca-times.brightspotcdn.com/dims4/default/a7ccc15/2147483647/strip/true/crop/2048x1152+0+0/resize/840x473!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fd5%2Fb5%2Fa8bffb00214d8bd8149373c18a6a%2Fla-1467703026-snap-photo",
        name: "la-1467703026-snap-photo",
      },
      {
        url: "https://i.imgur.com/zzJdv34.jpg",
        name: "zzJdv34.jpg",
      },
      {
        url: "https://images.squarespace-cdn.com/content/v1/55f009c8e4b079158f302bab/1447674317474-MGXBJ05SP7RPMWNPENSN/happy.jpg",
        name: "happy.jpg",
      },
    ]);
  });

  test("convert popular Search Engines image result page link to image URL", () => {
    expect(
      splitValueIntoUrlItems({
        value: `
          Google

          https://www.google.com/imgres?imgurl=https%3A%2F%2Fpyxis.nymag.com%2Fv1%2Fimgs%2Ffdf%2Fdb0%2F421af17121276a71945282e440357c43cb-25-post-malone-2.rsquare.w700.jpg&imgrefurl=https%3A%2F%2Fwww.vulture.com%2F2018%2F07%2Fwhat-if-post-malone-is-here-forever.html&tbnid=SXkwkfjI2KVYhM&vet=12ahUKEwiJpvKtwPfxAhVVmp4KHcFvCE8QMygAegUIARDKAQ..i&docid=t7sV80naYfuLaM&w=700&h=699&itg=1&q=post%20malone&ved=2ahUKEwiJpvKtwPfxAhVVmp4KHcFvCE8QMygAegUIARDKAQ

          Bing

          https://www.bing.com/images/search?view=detailV2&ccid=L4bFJgvm&id=DDF2BE12816813694C33498DF223DCE4D53A0144&thid=OIP.L4bFJgvmXyaADC-IzDmqawHaE7&mediaurl=https%3a%2f%2fwww.trbimg.com%2fimg-5a68a878%2fturbine%2fct-grumpy-cat-lawsuit-20180124&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.2f86c5260be65f26800c2f88cc39aa6b%3frik%3dRAE61eTcI%252fKNSQ%26pid%3dImgRaw&exph=1333&expw=2000&q=cat&simid=608011367438580912&FORM=IRPRST&ck=EB710DF3CFF3128BA95A107D240C5C4D&selectedIndex=1

          Yahoo

          https://images.search.yahoo.com/images/view;_ylt=Awr9JhXx0_lgcWEATM6JzbkF;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzQxODE0OTE1ODY0NmNmYjZkNjQ4YjhkNDM1ZGIxYjZjBGdwb3MDNARpdANiaW5n?back=https%3A%2F%2Fimages.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Ddog%26fr%3Dyfp-t%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D4&w=1024&h=681&imgurl=www.fitbark.com%2Fwp-content%2Fuploads%2F2019%2F02%2FFitBark_dog_stick_chewing.jpg&rurl=https%3A%2F%2Fwww.fitbark.com%2Fblog%2Fhow-to-treat-destructive-chewing-problem-in-your-dog%2F&size=167.2KB&p=dog&oid=418149158646cfb6d648b8d435db1b6c&fr2=piv-web&fr=yfp-t&tt=How+to+Treat+Destructive+Chewing+Problem+in+your+Dog%3F+%7C+FitBark&b=0&ni=21&no=4&ts=&tab=organic&sigr=6DTWDxdxtVmY&sigb=v1RigyiPm4Xm&sigi=wn7NXp.g.uS0&sigt=Qp7FsEdNni8T&.crumb=P9jMJnqzUyR&fr=yfp-t&fr2=piv-web

          Baidu

          https://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=mewtwo&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined&copyright=undefined&cs=4210541514,4292212275&os=105519535,2648604455&simid=0,0&pn=7&rn=1&di=34430&ln=424&fr=&fmq=1626985760181_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=0&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%253A%252F%252Fgss0.bdstatic.com%252F94o3dSag_xI4khGkpoWK1HF6hhy%252Fbaike%252Fc0%253Dbaike80%252C5%252C5%252C80%252C26%252Fsign%253Dadac147946166d222c7a1dc6274a6292%252F48540923dd54564e6a0f778bb6de9c82d1584f1e.jpg%26refer%3Dhttp%253A%252F%252Fgss0.bdstatic.com%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Djpeg%3Fsec%3D1629577757%26t%3D2d005bb63adb40c1d0495df4f8d0109c&rpstart=0&rpnum=0&adpicid=0&nojc=undefined&ctd=1626985770332^3_1905X981%1
          `,
      }).map((item) => ({ name: item.name, url: item.content }))
    ).toStrictEqual([
      {
        url: "https://pyxis.nymag.com/v1/imgs/fdf/db0/421af17121276a71945282e440357c43cb-25-post-malone-2.rsquare.w700.jpg",
        name: "421af17121276a71945282e440357c43cb-25-post-malone-2.rsquare.w700.jpg",
      },
      {
        url: "https://www.trbimg.com/img-5a68a878/turbine/ct-grumpy-cat-lawsuit-20180124",
        name: "ct-grumpy-cat-lawsuit-20180124",
      },
      {
        url: "https://www.fitbark.com/wp-content/uploads/2019/02/FitBark_dog_stick_chewing.jpg",
        name: "FitBark_dog_stick_chewing.jpg",
      },
      {
        url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.bdstatic.com%2F94o3dSag_xI4khGkpoWK1HF6hhy%2Fbaike%2Fc0%3Dbaike80%2C5%2C5%2C80%2C26%2Fsign%3Dadac147946166d222c7a1dc6274a6292%2F48540923dd54564e6a0f778bb6de9c82d1584f1e.jpg&refer=http%3A%2F%2Fgss0.bdstatic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629577757&t=2d005bb63adb40c1d0495df4f8d0109c",
        name: "gss0.bdstatic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg",
      },
    ]);
  });

  test("grab id from youtube link (video or thumbnail)", () => {
    expect(
      splitValueIntoUrlItems({
        value: `
          // youtube thumbnail urls
          https://i.ytimg.com/vi/M-XN2L1eJtI/maxresdefault.jpg
          https://img.youtube.com/vi/XICFqibVbGw/0.jpg

          // youtube video urls
          https://www.youtube-nocookie.com/embed/up_lNV-yoK4?rel=0 
          https://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo 
          https://www.youtube.com/watch?v=cKZDdG9FTKY&feature=channel 
          https://www.youtube.com/watch?v=yZ-K7nCVnBI&playnext_from=TL&videos=osPknwzXEas&feature=sub 
          https://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I 
          https://www.youtube.com/user/SilkRoadTheatre#p/a/u/2/6dwqZw0j_jY
          https://youtu.be/6dwqZw0j_jY
          https://www.youtube.com/watch?v=6dwqZw0j_jY&feature=youtu.be
          https://youtu.be/afa-5HQHiAs
          https://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo?rel=0
          https://www.youtube.com/watch?v=cKZDdG9FTKY&feature=channel
          https://www.youtube.com/watch?v=yZ-K7nCVnBI&playnext_from=TL&videos=osPknwzXEas&feature=sub
          https://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I
          https://www.youtube.com/embed/nas1rJpm7wY?rel=0
          https://www.youtube.com/watch?v=peFZbP64dsU
          https://youtube.com/v/dQw4w9WgXcQ?feature=youtube_gdata_player
          https://youtube.com/vi/dQw4w9WgXcQ?feature=youtube_gdata_player
          https://youtube.com/?v=dQw4w9WgXcQ&feature=youtube_gdata_player
          https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player
          https://youtube.com/?vi=dQw4w9WgXcQ&feature=youtube_gdata_player
          https://youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player
          https://youtube.com/watch?vi=dQw4w9WgXcQ&feature=youtube_gdata_player
          https://youtu.be/dQw4w9WgXcQ?feature=youtube_gdata_player
          `,
      }).map((item) => item.name)
    ).toStrictEqual([
      "M-XN2L1eJtI",
      "XICFqibVbGw",
      "up_lNV-yoK4",
      "1p3vcRhsYGo",
      "cKZDdG9FTKY",
      "yZ-K7nCVnBI",
      "NRHVzbJVx8I",
      "6dwqZw0j_jY",
      "6dwqZw0j_jY",
      "6dwqZw0j_jY",
      "afa-5HQHiAs",
      "1p3vcRhsYGo",
      "cKZDdG9FTKY",
      "yZ-K7nCVnBI",
      "NRHVzbJVx8I",
      "nas1rJpm7wY",
      "peFZbP64dsU",
      "dQw4w9WgXcQ",
      "dQw4w9WgXcQ",
      "dQw4w9WgXcQ",
      "dQw4w9WgXcQ",
      "dQw4w9WgXcQ",
      "dQw4w9WgXcQ",
      "dQw4w9WgXcQ",
      "dQw4w9WgXcQ",
    ]);
  });
});

export {};
