import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { batch, useDispatch } from "react-redux";
import { useMatchMedia } from "../../hooks/useMatchMedia";
import { TDemographicsResponse } from "../../ts";
import dataURLtoFile from "../../utils/dataURLtoFile";
import { delayP } from "../../utils/delayP";
import { JSON_Stringify_Parse } from "../../utils/jsonStringifyParse";
import createCroppedImgUrl from "../FaceDetectionResult/BoundingCroppedImage/createCroppedImgUrl";
import {
  addDemographicsParentAndChildren,
  TDemographicNode,
} from "../FaceDetectionResult/ImageResult/demographicsSlice";
import { addImage } from "../FaceDetectionResult/InfoResult/Table/imageHeightSlice";
import { animateResult, startAnimate } from "../UploadImageForm/animateUpload";
import {
  setImageLoaded,
  setImageStatus,
  setUri,
} from "../UploadImageForm/imageUrlSlice";
import { postMaloneData } from "./postMalonData";
import { postMaloneUri } from "./postMaloneUri";

const LandingPageImgExample = () => {
  const dispatch = useDispatch();
  const svgRef = useRef<SVGSVGElement>(null);
  const fakeUrlBarLoaderElRef = useRef<SVGRectElement>(null);
  const hasClickedRef = useRef(false);

  const mqlRef = useMatchMedia();

  const onClick = () => {
    if (hasClickedRef.current) return;
    hasClickedRef.current = true;

    fakeUrlBarLoaderElRef.current!.classList.add("active");

    setTimeout(async () => {
      const result = (JSON_Stringify_Parse(
        postMaloneData
      ) as unknown) as TDemographicsResponse;
      const objectUrl = window.URL.createObjectURL(
        dataURLtoFile(postMaloneUri)
      );
      const img = new Image();
      img.src = objectUrl;

      await new Promise((resolve) => {
        img.onload = () => {
          resolve(true);
        };
      });

      await startAnimate({ firstImage: true });

      const data = (result.data as unknown) as TDemographicNode[];

      for (const item of data) {
        item.hoverActive = false;
        item.scrollIntoView = false;
        item.generalHover = false;
        (item.removed = false),
          (item.uri = await createCroppedImgUrl({
            boundingBox: item.bounding_box,
            img: {
              src: postMaloneUri,
              naturalHeight: img.naturalHeight,
              naturalWidth: img.naturalWidth,
            },
          }));
      }

      const name = "post-malone-dj-khaled-billboard.jpg";
      const parentId = name + "superid";

      batch(() => {
        dispatch(setUri(objectUrl));
        dispatch(setImageLoaded(true));
        dispatch(setImageStatus("DONE"));
        dispatch(addImage({ id: parentId, imageHeight: null }));
        dispatch(
          addDemographicsParentAndChildren({
            parent: {
              id: parentId,
              name,
              hoverActive: false,
              imageUrl: {
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                uri: objectUrl,
              },
            },
            data,
          })
        );
      });

      await delayP(200);

      animateResult({
        id: parentId,
        mql: mqlRef.current!,
        firstImage: true,
      });

      setTimeout(() => {
        hasClickedRef.current = false;

        fakeUrlBarLoaderElRef.current!.classList.remove("active");
      }, 500);
    }, 1400);
  };

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="296.713"
      height="184.524"
      viewBox="0 0 78.505 48.822"
      aria-label="Interactive graphic. Demonstrating a before an after of image that features celebrities Post Malone and DJ Khaled, where the after image is drawn with bounding-boxes around their faces"
    >
      <defs>
        <linearGradient id="c">
          <stop offset="0" stopColor="#c5c5c5"></stop>
          <stop offset="1" stopColor="#e9e9e9"></stop>
        </linearGradient>
        <linearGradient id="b">
          <stop offset="0" stopColor="#0024c1"></stop>
          <stop offset="1"></stop>
        </linearGradient>
        <linearGradient id="a">
          <stop offset="0"></stop>
          <stop offset="1" stopColor="#4c66d5"></stop>
        </linearGradient>
        <linearGradient
          id="h"
          x1="114.355"
          x2="130.194"
          y1="147.971"
          y2="147.97"
          gradientTransform="translate(-77.58 -145.969)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#a"
        ></linearGradient>
        <linearGradient
          id="g"
          x1="86.045"
          x2="111.95"
          y1="149.101"
          y2="149.101"
          gradientTransform="translate(-77.327 -145.969)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#b"
        ></linearGradient>
        <linearGradient
          id="d"
          x1="35.896"
          x2="38.349"
          y1="6.188"
          y2="4.361"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#c"
        ></linearGradient>
        <filter
          id="e"
          width="1.184"
          height="1.078"
          x="-0.092"
          y="-0.039"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="0.301"></feGaussianBlur>
        </filter>
        <filter
          id="f"
          width="1.028"
          height="1.241"
          x="-0.014"
          y="-0.121"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="0.2"></feGaussianBlur>
        </filter>
        <filter id="saturate-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="hueRotate"
            values="0"
            result="color1"
            id="feColorMatrix1180"
          />
          <feColorMatrix
            type="saturate"
            values=".502"
            result="color2"
            id="feColorMatrix1182"
          />
        </filter>
        <mask id="j" maskUnits="userSpaceOnUse">
          <path
            fill="#fff"
            strokeLinecap="round"
            strokeWidth="0.465"
            d="M10.279 8.486h9.51v12.236h-9.51z"
            paintOrder="markers fill stroke"
          ></path>
        </mask>
        <mask id="k" maskUnits="userSpaceOnUse">
          <path
            fill="#fff"
            strokeLinecap="round"
            strokeWidth="0.465"
            d="M20.622 12.384h7.774v11.425h-7.774z"
            paintOrder="markers fill stroke"
          ></path>
        </mask>
      </defs>
      <path
        className="face-blob"
        fill="#224aff"
        fillOpacity="0.094"
        d="M49.372 46.782c-5.274-3.634-29.26-8.662-35.156-13.807-3.808-3.324 8.772-6.026 9.146-10.685.67-8.339 12.44-14.647 20.786-14.064 8.438.588 19.817 8.6 18.836 17.002C74.84 41.51 59.644 53.86 49.372 46.782z"
      ></path>
      <path
        fill="url(#d)"
        d="M0 0h37.515v30.78H0z"
        paintOrder="markers fill stroke"
      ></path>
      <path
        style={{ mixBlendMode: "normal" }}
        d="M29.133 11.663h7.829v18.599h-7.829z"
        filter="url(#e)"
        paintOrder="markers fill stroke"
      ></path>
      <g className="faces-original" filter="url(#saturate-filter)">
        <path
          className="faces-original__shadow"
          fill="#c5c5c5"
          d="M2.169 5.368h37.404v27.593H2.169z"
          paintOrder="markers fill stroke"
        ></path>
        <g className="faces-original__image">
          <image
            id="i"
            width="37.515"
            height="24.79"
            x="0"
            y="5.99"
            strokeWidth="5.219"
            preserveAspectRatio="none"
            xlinkHref={postMaloneUri}
          ></image>
        </g>
      </g>
      <g
        tabIndex={0}
        role="button"
        aria-label="use imgur link to detect faces of image featuring celebrities Post Malone and DJ Khaled"
        className="fake-url-bar"
        paintOrder="markers fill stroke"
        onClick={onClick}
      >
        <rect
          className="fake-url-bar-shadow"
          width="34.121"
          height="3.987"
          x="1.68"
          y="1.399"
          opacity="0"
          fillOpacity="0.715"
          filter="url(#f)"
          ry="1.257"
        ></rect>
        <rect
          ref={fakeUrlBarLoaderElRef}
          className="fake-url-bar-loader"
          width="34.121"
          height="3.987"
          x="1.729"
          y="1.122"
          fill="#fff"
          stroke="#00f"
          strokeWidth="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          ry="1.257"
        ></rect>
        <rect
          className="fake-url-bar-outline"
          width="34.121"
          height="3.987"
          x="1.729"
          y="1.122"
          fill="none"
          opacity="0"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.3"
        ></rect>
        <g
          fill="url(#g)"
          strokeWidth="0.114"
          aria-label="https://i.imgur.com/nt0RgAH.jpg"
        >
          <path d="M4.034 3.009v.65h-.177v-.644q0-.153-.06-.229-.059-.076-.178-.076-.143 0-.226.091-.082.092-.082.25v.607h-.178V2.164h.178v.586q.063-.097.148-.145.087-.049.2-.049.185 0 .28.116.095.114.095.337zM4.563 2.277v.305h.364v.138h-.364v.584q0 .131.036.169.036.037.147.037h.181v.148h-.181q-.205 0-.283-.076-.077-.076-.077-.278V2.72h-.13v-.138h.13v-.305zM5.336 2.277v.305H5.7v.138h-.364v.584q0 .131.035.169.037.037.147.037H5.7v.148h-.182q-.204 0-.282-.076-.078-.076-.078-.278V2.72h-.13v-.138h.13v-.305zM6.104 3.497v.57h-.178V2.583h.178v.164q.056-.096.14-.142.086-.048.204-.048.196 0 .318.156.123.156.123.41 0 .253-.123.409-.122.155-.318.155-.118 0-.204-.046-.084-.047-.14-.143zm.602-.376q0-.195-.081-.305-.08-.112-.22-.112t-.221.112q-.08.11-.08.305t.08.307q.08.11.22.11.141 0 .22-.11.082-.112.082-.307zM7.868 2.614v.167q-.075-.038-.156-.057-.08-.02-.167-.02-.131 0-.198.04-.065.041-.065.122 0 .061.047.097.047.034.19.066l.06.014q.188.04.267.114.08.073.08.205 0 .15-.12.237-.118.087-.325.087-.087 0-.18-.017-.094-.016-.198-.05v-.183q.098.051.193.077.095.025.189.025.125 0 .192-.042.067-.043.067-.121 0-.072-.049-.11-.048-.039-.212-.074l-.062-.015q-.164-.034-.237-.106-.073-.072-.073-.197 0-.151.108-.234.107-.083.305-.083.098 0 .185.015.086.014.159.043zM8.253 3.414h.203v.244h-.203zm0-.773h.203v.244h-.203zM9.187 2.224h.163l-.5 1.617h-.163zM9.852 2.224h.163l-.5 1.617h-.163zM10.202 2.582h.177v1.076h-.177zm0-.418h.177v.223h-.177zM10.773 3.414h.203v.244h-.203zM11.374 2.582h.177v1.076h-.177zm0-.418h.177v.223h-.177zM12.758 2.789q.066-.12.158-.176.092-.057.217-.057.168 0 .26.119.091.117.091.334v.65h-.178v-.644q0-.155-.054-.23-.055-.075-.168-.075-.137 0-.217.091-.08.092-.08.25v.607h-.177v-.643q0-.156-.055-.23-.055-.075-.169-.075-.135 0-.215.092-.08.092-.08.248v.608h-.178V2.582h.178v.168q.06-.1.145-.146.085-.048.2-.048.118 0 .2.06.082.06.122.173zM14.546 3.108q0-.192-.08-.298-.079-.106-.222-.106-.142 0-.222.106-.079.106-.079.298 0 .191.079.297.08.105.222.105.143 0 .222-.105.08-.106.08-.297zm.176.417q0 .275-.122.408-.122.135-.373.135-.094 0-.176-.015-.083-.013-.16-.042v-.172q.077.042.153.062.076.02.155.02.174 0 .26-.09.087-.091.087-.274v-.088q-.055.095-.14.142-.086.047-.205.047-.198 0-.32-.15-.12-.151-.12-.4 0-.25.12-.4.122-.152.32-.152.119 0 .204.048.086.047.14.142v-.164h.177zM15.068 3.234v-.652h.177v.645q0 .153.06.23.059.076.178.076.143 0 .226-.092.083-.091.083-.249v-.61h.177v1.076h-.177v-.165q-.064.098-.15.146-.084.047-.196.047-.186 0-.282-.115-.096-.115-.096-.337zm.445-.678zM16.959 2.748q-.03-.018-.066-.025-.034-.009-.076-.009-.15 0-.231.098-.08.097-.08.28v.566h-.177V2.582h.177v.168q.056-.098.145-.145.09-.049.217-.049.019 0 .04.003.023.002.05.007zM16.99 3.414h.203v.244h-.203zM18.366 2.624v.165q-.075-.041-.15-.062-.076-.02-.152-.02-.172 0-.268.109-.095.108-.095.305t.095.307q.096.108.268.108.076 0 .151-.02.076-.021.151-.062v.163q-.074.035-.154.052-.078.017-.168.017-.243 0-.386-.153-.143-.152-.143-.412 0-.263.144-.414.145-.15.397-.15.081 0 .16.017.077.016.15.05zM19.092 2.706q-.142 0-.224.112-.083.11-.083.303t.082.305q.082.11.225.11.142 0 .224-.111.083-.112.083-.304 0-.19-.083-.302-.082-.113-.224-.113zm0-.15q.23 0 .363.15.131.15.131.415t-.131.415q-.132.15-.363.15-.231 0-.363-.15-.13-.15-.13-.415t.13-.415q.132-.15.363-.15zM20.716 2.789q.066-.12.158-.176.093-.057.218-.057.168 0 .259.119.091.117.091.334v.65h-.178v-.644q0-.155-.054-.23-.055-.075-.167-.075-.138 0-.218.091-.08.092-.08.25v.607h-.177v-.643q0-.156-.055-.23-.055-.075-.169-.075-.135 0-.215.092-.08.092-.08.248v.608h-.178V2.582h.178v.168q.06-.1.145-.146.085-.048.201-.048.117 0 .199.06.083.06.122.173zM22.11 2.224h.163l-.5 1.617h-.163zM23.355 3.009v.65h-.177v-.644q0-.153-.06-.229-.059-.076-.178-.076-.143 0-.226.091-.083.092-.083.25v.607h-.177V2.582h.177v.168q.064-.097.15-.145.086-.049.198-.049.186 0 .28.116.096.114.096.337zM23.884 2.277v.305h.364v.138h-.364v.584q0 .131.036.169.036.037.147.037h.181v.148h-.181q-.205 0-.283-.076-.078-.076-.078-.278V2.72h-.13v-.138h.13v-.305zM24.922 2.352q-.15 0-.226.148-.075.147-.075.443 0 .295.075.443.076.147.226.147.15 0 .225-.147.076-.148.076-.443 0-.296-.076-.443-.074-.148-.225-.148zm0-.154q.24 0 .368.191.127.19.127.554 0 .362-.127.553-.127.19-.368.19t-.37-.19q-.126-.191-.126-.553 0-.363.127-.554.128-.19.369-.19zM26.422 2.986q.063.021.121.09.06.07.12.19l.196.392h-.208l-.184-.368q-.07-.144-.138-.19-.066-.048-.182-.048h-.21v.606h-.195V2.224h.438q.246 0 .367.103t.121.31q0 .136-.063.225-.063.09-.183.124zm-.486-.602v.509h.244q.14 0 .211-.065.073-.065.073-.19 0-.127-.073-.19-.07-.064-.21-.064zM27.81 3.108q0-.192-.08-.298-.078-.106-.221-.106-.142 0-.222.106-.079.106-.079.298 0 .191.079.297.08.105.222.105.143 0 .222-.105.08-.106.08-.297zm.177.417q0 .275-.122.408-.122.135-.374.135-.093 0-.175-.015-.083-.013-.16-.042v-.172q.077.042.153.062.076.02.155.02.173 0 .26-.09.086-.091.086-.274v-.088q-.054.095-.14.142-.085.047-.204.047-.198 0-.32-.15-.12-.151-.12-.4 0-.25.12-.4.122-.152.32-.152.119 0 .204.048.086.047.14.142v-.164h.177zM28.838 2.415l-.263.714h.527zm-.11-.19h.22l.547 1.433h-.201l-.131-.368h-.647l-.13.368h-.205zM29.704 2.224h.194v.588h.705v-.588h.194v1.434h-.194v-.683h-.705v.683h-.194zM31.166 3.414h.203v.244h-.203zM31.767 2.582h.177v1.096q0 .205-.079.297-.077.093-.251.093h-.068v-.15h.047q.101 0 .138-.047.036-.046.036-.193zm0-.418h.177v.223h-.177zM32.484 3.497v.57h-.178V2.583h.178v.164q.056-.096.14-.142.086-.048.204-.048.196 0 .318.156.123.156.123.41 0 .253-.123.409-.122.155-.318.155-.118 0-.204-.046-.084-.047-.14-.143zm.601-.376q0-.195-.08-.305-.08-.112-.22-.112t-.221.112q-.08.11-.08.305t.08.307q.08.11.22.11.141 0 .22-.11.081-.112.081-.307zM34.27 3.108q0-.192-.08-.298-.079-.106-.222-.106-.142 0-.222.106-.078.106-.078.298 0 .191.078.297.08.105.222.105.143 0 .222-.105.08-.106.08-.297zm.177.417q0 .275-.122.408-.122.135-.374.135-.093 0-.176-.015-.082-.013-.16-.042v-.172q.078.042.153.062.076.02.155.02.174 0 .26-.09.087-.091.087-.274v-.088q-.055.095-.14.142-.086.047-.205.047-.198 0-.319-.15-.121-.151-.121-.4 0-.25.121-.4.121-.152.319-.152.12 0 .205.048.085.047.14.142v-.164h.177z"></path>
        </g>
      </g>
      <g className="faces-arrow" onClick={onClick}>
        <path
          className="arrow-body"
          fill="none"
          stroke="url(#h)"
          strokeWidth="0.665"
          d="M36.833 3.017c18.9-4.79 25.894-1.812 22.805.574"
        ></path>
        <path
          fill="none"
          stroke="#000"
          strokeWidth="0.665"
          d="M39.934.356l-3.101 2.661 2.692 1.627"
        ></path>
      </g>
      <g
        tabIndex={0}
        role="button"
        aria-label="Click me: Detect faces of image featuring celebrities Post Malone and DJ Khaled"
        className="face-btn"
        onClick={onClick}
      >
        <rect
          className="face-btn-bg"
          width="17.687"
          height="5.001"
          x="49.555"
          y="2.753"
          fill="#1643ff"
          fillOpacity="0.134"
          paintOrder="markers fill stroke"
          ry="0"
        ></rect>
        <g
          fill="#2b45b6"
          strokeWidth="0.11"
          aria-label="Click me"
          opacity="0.969"
        >
          <path d="M53.497 4.217q-.328 0-.632.177-.304.175-.49.467-.188.291-.188.613 0 .355.242.59.244.235.625.235.53 0 .99-.465l.186.143q-.554.58-1.233.58-.316 0-.565-.134-.248-.136-.386-.37-.137-.238-.137-.533 0-.292.137-.579.138-.288.36-.505.224-.218.528-.352.305-.135.621-.135.677 0 .984.58l-.25.156-.037-.06q-.01-.019-.053-.077-.043-.06-.08-.093-.037-.034-.105-.085-.067-.052-.138-.08-.07-.029-.17-.051-.1-.022-.209-.022zM54.792 6.535h-.273l.546-2.564h.27zM55.659 4.452q0-.093.074-.16.075-.067.164-.067.07 0 .115.043.047.043.047.107 0 .08-.07.152-.07.07-.169.07-.069 0-.115-.04-.046-.042-.046-.105zm-.117 2.083h-.271l.374-1.741h.268zM57.104 5.032q-.178 0-.345.108-.166.107-.27.287-.104.18-.104.378 0 .215.127.354.129.137.321.137.321 0 .584-.342l.21.126q-.383.477-.845.477-.304 0-.488-.197-.182-.198-.182-.5 0-.208.09-.409.09-.202.235-.352.146-.15.336-.24.192-.093.388-.093.134 0 .244.043.112.041.175.096.065.053.117.132.053.078.07.119.02.04.035.087l-.261.133q-.117-.344-.437-.344zM58.205 6.535h-.273l.546-2.564h.27l-.296 1.405.8-.586h.404l-.936.689.723 1.056h-.352l-.61-.888-.106.077zM61.509 5.13q.116-.153.27-.256.155-.103.288-.103.182 0 .28.098.097.096.12.261.127-.156.28-.257.152-.102.281-.102.211 0 .311.133.1.13.1.343 0 .088-.026.232l-.229 1.056h-.267l.223-1.056q.022-.108.022-.187 0-.114-.046-.186-.045-.074-.146-.074-.093 0-.225.112-.132.11-.235.26-.103.15-.127.262l-.186.869h-.27l.224-1.065q.022-.108.022-.185 0-.261-.19-.261-.088 0-.219.108-.128.106-.235.26-.105.152-.13.27l-.186.873h-.273l.265-1.23q.043-.185.043-.4 0-.074-.01-.115h.3q.007.047.007.115 0 .09-.036.225zM64.129 5.467h1.087q-.018-.198-.145-.318-.125-.122-.309-.122-.183 0-.36.122t-.273.318zm-.366.393q0-.277.151-.53.153-.257.397-.41.245-.154.505-.154.302 0 .489.203.187.2.187.501 0 .09-.027.25h-1.426q-.007.06-.007.092 0 .211.13.348.128.136.322.136.17 0 .335-.086.165-.087.3-.256l.208.126q-.093.118-.202.21-.109.088-.203.138-.094.05-.194.08-.098.032-.167.04-.067.01-.128.01-.304 0-.488-.198-.182-.197-.182-.5z"></path>
        </g>
      </g>
      <g className="faces-bounding-boxes">
        <path
          className="faces-bounding-boxes__shadow"
          fill="#224aff"
          d="M29.697 12.161h47.205v30.682H29.697z"
          paintOrder="markers fill stroke"
        ></path>
        <path
          className="faces-bounding-boxes__shadow-3d"
          fill="#224aff"
          d="M29.697 12.161h47.205v30.682H29.697z"
          paintOrder="markers fill stroke"
          opacity="0"
        ></path>
        <use
          width="100%"
          height="100%"
          strokeWidth="0.785"
          transform="translate(30.742 5.747) scale(1.27318)"
          xlinkHref="#i"
        ></use>
        <g className="face-malone">
          <use
            width="100%"
            height="100%"
            mask="url(#j)"
            transform="translate(30.734 5.726) scale(1.27318)"
            xlinkHref="#i"
          ></use>
          <path
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="0.561"
            d="M44.138 16.937h11.475v14.764H44.138z"
            paintOrder="markers fill stroke"
          ></path>
          <path
            fill="none"
            stroke="#224aff"
            strokeLinecap="round"
            strokeWidth="0.592"
            d="M43.821 16.53h12.108v15.578H43.821z"
            paintOrder="markers fill stroke"
          ></path>
        </g>
        <g className="face-khaled">
          <use
            width="100%"
            height="100%"
            mask="url(#k)"
            transform="translate(30.752 5.75) scale(1.27317)"
            xlinkHref="#i"
          ></use>
          <path
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="0.561"
            d="M57.266 21.896h9.38v13.785h-9.38z"
            paintOrder="markers fill stroke"
          ></path>
          <path
            fill="none"
            stroke="#224aff"
            strokeLinecap="round"
            strokeWidth="0.592"
            d="M57.007 21.516h9.898v14.546h-9.898z"
            paintOrder="markers fill stroke"
          ></path>
        </g>
      </g>
    </svg>
  );
};

export default LandingPageImgExample;
