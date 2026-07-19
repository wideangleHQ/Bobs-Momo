// @ts-nocheck
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function createCardMetadataCanvas(item, textColor) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const dpr = Math.min(window.devicePixelRatio || 1, 2) * 1.5;
  const width = 400 * dpr;
  const height = 550 * dpr;
  canvas.width = width;
  canvas.height = height;

  context.scale(dpr, dpr);
  context.clearRect(0, 0, 400, 550);

  const cardW = 400;
  const padding = 20;

  // Badges at the top over image
  let badgeX = padding;
  const badgeY = padding;

  function drawBadge(text, bgColor, fgColor) {
    context.font = '800 11px Poppins, sans-serif';
    const metrics = context.measureText(text);
    const w = metrics.width + 16;
    const h = 24;
    context.fillStyle = bgColor;
    context.beginPath();
    if (context.roundRect) {
      context.roundRect(badgeX, badgeY, w, h, 12);
    } else {
      context.rect(badgeX, badgeY, w, h);
    }
    context.fill();

    context.fillStyle = fgColor;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(text, badgeX + w / 2, badgeY + h / 2 + 1);
    badgeX += w + 8;
  }



  if (item.isVeg !== undefined) {
    drawBadge(item.isVeg ? '🟢 Veg' : '🔴 Non-Veg', item.isVeg ? '#22c55e' : '#ef4444', '#ffffff');
  }
  if (item.isChefSpecial) {
    drawBadge("⭐ Chef's Special", '#fbbf24', '#1a1a1a');
  }
  if (item.tags && item.tags.includes('Best Seller')) {
    drawBadge('🔥 Bestseller', '#ef4444', '#ffffff');
  }
  if (item.tags && item.tags.includes('New')) {
    drawBadge('🆕 New', '#3b82f6', '#ffffff');
  }

  // The image height is 0.55 (55%), so white area starts around y=302.5. 
  // Let's start text at y=320.
  let currentY = 320;

  // Priority 1: Large Product Name
  context.font = '900 24px Boldfinger, Poppins, sans-serif';
  context.fillStyle = '#1A1A1A';
  context.textAlign = 'left';
  context.textBaseline = 'top';

  const nameMaxWidth = cardW - padding * 2;
  const nameWords = item.title.toUpperCase().split(' ');
  let nameLine = '';
  for (let n = 0; n < nameWords.length; n++) {
    const testLine = nameLine + nameWords[n] + ' ';
    const metrics = context.measureText(testLine);
    if (metrics.width > nameMaxWidth && n > 0) {
      context.fillText(nameLine, padding, currentY);
      nameLine = nameWords[n] + ' ';
      currentY += 28;
    } else {
      nameLine = testLine;
    }
  }
  context.fillText(nameLine, padding, currentY);
  currentY += 34;

  // Priority 2: Short Description
  context.font = '500 13px Poppins, sans-serif';
  context.fillStyle = '#666666';

  const descWords = item.ingredients.split(' ');
  let descLine = '';
  let lineCount = 0;
  const maxDescLines = 2;

  for (let n = 0; n < descWords.length; n++) {
    const testLine = descLine + descWords[n] + ' ';
    const metrics = context.measureText(testLine);

    if (metrics.width > nameMaxWidth && n > 0) {
      if (lineCount === maxDescLines - 1) {
        context.fillText(descLine.trim() + '...', padding, currentY);
        lineCount++;
        break;
      }
      context.fillText(descLine, padding, currentY);
      descLine = descWords[n] + ' ';
      currentY += 20;
      lineCount++;
    } else {
      descLine = testLine;
    }
  }
  if (lineCount < maxDescLines) {
    context.fillText(descLine, padding, currentY);
  }
  currentY += 32;

  // Priority 3: Price Variants (Chips)
  let chipX = padding;
  let chipY = currentY;
  const chipH = 32;

  context.font = '700 13px Poppins, sans-serif';

  if (item.variants && item.variants.length > 0) {
    for (const variant of item.variants) {
      const chipText = variant.label ? `${variant.label} ₹${variant.price}` : `₹${variant.price}`;
      const metrics = context.measureText(chipText);
      const chipW = metrics.width + 24;

      if (chipX + chipW > cardW - padding) {
        chipX = padding;
        chipY += chipH + 10;
      }

      context.fillStyle = '#F5F5F5';
      context.beginPath();
      if (context.roundRect) {
        context.roundRect(chipX, chipY, chipW, chipH, 8);
      } else {
        context.rect(chipX, chipY, chipW, chipH);
      }
      context.fill();

      context.fillStyle = '#1A1A1A';
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.fillText(chipText, chipX + chipW / 2, chipY + chipH / 2 + 1);

      chipX += chipW + 10;
    }
  }

  // Priority 4: Category at Bottom
  const catText = item.category.toUpperCase().replace('_', ' ');
  context.font = '800 11px Poppins, sans-serif';
  const catMetrics = context.measureText(catText);
  const catW = catMetrics.width + 16;
  const catH = 24;

  const bottomY = 550 - padding - catH;

  context.fillStyle = '#E9171F';
  context.beginPath();
  if (context.roundRect) {
    context.roundRect(padding, bottomY, catW, catH, 6);
  } else {
    context.rect(padding, bottomY, catW, catH);
  }
  context.fill();

  context.fillStyle = '#FFFFFF';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillText(catText, padding + catW / 2, bottomY + catH / 2 + 1);

  return canvas;
}

const MEDIA_VERTEX = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const MEDIA_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec2 uImageSizes;
  uniform vec2 uPlaneSizes;
  uniform sampler2D tMap;
  uniform float uBorderRadius;
  uniform float uOpacity;
  varying vec2 vUv;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b;
    return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
  }

  void main() {
    float imgHeight = 0.55;
    vec4 finalColor;
    vec4 cardBg = vec4(1.0, 1.0, 1.0, 1.0);

    if (vUv.y >= (1.0 - imgHeight)) {
      float normalizedY = (vUv.y - (1.0 - imgHeight)) / imgHeight;
      vec2 imgPlaneSizes = vec2(uPlaneSizes.x, uPlaneSizes.y * imgHeight);
      vec2 ratio = vec2(
        min((imgPlaneSizes.x / imgPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
        min((imgPlaneSizes.y / imgPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
      );
      vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        normalizedY * ratio.y + (1.0 - ratio.y) * 0.5
      );

      vec4 color = texture2D(tMap, uv);
      vec4 imgBg = vec4(0.988, 0.98, 0.965, 1.0);
      finalColor = mix(imgBg, vec4(color.rgb, 1.0), color.a);
    } else {
      finalColor = cardBg;
    }

    float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
    float edgeSmooth = 0.002;
    float alpha = (1.0 - smoothstep(-edgeSmooth, edgeSmooth, d)) * uOpacity;

    gl_FragColor = vec4(finalColor.rgb, alpha);
  }
`;

const TITLE_VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TITLE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(tMap, vUv);
    if (color.a < 0.05) discard;
    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  }
`;

/**
 * Pooled card object. Created once, then rebound to new menu items via setItem().
 * Owns no GL resources of its own: geometry, programs and textures are shared,
 * per-card uniform values are injected right before each draw via onBeforeRender.
 */
class Media {
  constructor({ app }) {
    this.app = app;
    this.gl = app.gl;
    this.item = null;
    this.index = 0;
    this.length = 0;
    this.extra = 0;
    this.opacity = 1;
    this.planeSizes = [0, 0];
    this.textureEntry = null;
    this.titleTexture = null;
    this.createMeshes();
  }
  createMeshes() {
    this.plane = new Mesh(this.gl, {
      geometry: this.app.planeGeometry,
      program: this.app.mediaProgram
    });
    this.plane.visible = false;
    this.plane.setParent(this.app.scene);
    this.plane.onBeforeRender(() => {
      const u = this.app.mediaProgram.uniforms;
      u.tMap.value = this.textureEntry.texture;
      u.uImageSizes.value[0] = this.textureEntry.width;
      u.uImageSizes.value[1] = this.textureEntry.height;
      u.uPlaneSizes.value[0] = this.planeSizes[0];
      u.uPlaneSizes.value[1] = this.planeSizes[1];
      u.uOpacity.value = this.opacity;
    });

    this.titleMesh = new Mesh(this.gl, {
      geometry: this.app.titleGeometry,
      program: this.app.titleProgram
    });
    this.titleMesh.position.set(0, 0, 0.01);
    this.titleMesh.setParent(this.plane);
    this.titleMesh.onBeforeRender(() => {
      const u = this.app.titleProgram.uniforms;
      u.tMap.value = this.titleTexture;
      u.uOpacity.value = this.opacity;
    });
  }
  setItem(item, index, length) {
    this.item = item;
    this.index = index;
    this.length = length;
    this.extra = 0;
    this.isBefore = false;
    this.isAfter = false;
    this.textureEntry = this.app.getImageTexture(item.image);
    this.titleTexture = this.app.getTitleTexture(item);
    this.plane.visible = true;
    this.onResize();
  }
  hide() {
    this.plane.visible = false;
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.app.viewport.width / 2;
    const bend = this.app.bend;

    if (bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
      this.plane.position.z = 0;
      this.plane.rotation.y = 0;
    } else {
      const B_abs = Math.abs(bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }

      const angle = effectiveX / R;
      this.plane.position.z = (Math.cos(angle) - 1) * R * 0.8;

      if (bend > 0) {
        this.plane.rotation.y = -Math.sign(x) * angle * 1.1;
      } else {
        this.plane.rotation.y = Math.sign(x) * angle * 1.1;
      }
    }

    const distFromCenter = Math.abs(this.plane.position.x);
    const maxDist = this.width * 1.5;
    const normDist = Math.min(distFromCenter / maxDist, 1.0);

    const scaleFactor = 1.02 - normDist * 0.14;

    this.plane.scale.x = (this.targetWidthPx * this.pxToUnits) * scaleFactor;
    this.plane.scale.y = (this.targetHeightPx * this.pxToUnits) * scaleFactor;

    this.opacity = 1.0 - normDist * 0.9;

    this.speed = scroll.current - scroll.last;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.app.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize() {
    const screen = this.app.screen;
    const viewport = this.app.viewport;

    this.pxToUnits = viewport.height / screen.height;

    this.targetWidthPx = 400;
    this.targetHeightPx = 550;
    this.gapPx = 28;

    if (screen.width < 768) {
      this.targetWidthPx = screen.width * 0.70;
      this.targetHeightPx = screen.height * 0.55;
      this.gapPx = screen.width * 0.04;
    } else if (screen.width < 1200) {
      this.targetWidthPx = 300;
      this.targetHeightPx = 430;
      this.gapPx = 20;
    }

    this.plane.scale.y = this.targetHeightPx * this.pxToUnits;
    this.plane.scale.x = this.targetWidthPx * this.pxToUnits;

    this.planeSizes[0] = this.plane.scale.x;
    this.planeSizes[1] = this.plane.scale.y;

    this.padding = this.gapPx * this.pxToUnits;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;

    this.titleMesh.scale.set(this.plane.scale.x, this.plane.scale.y, 1);
    this.titleMesh.position.set(0, 0, 0.01);
  }
}

/**
 * Initialize-once WebGL orchestrator.
 * Renderer, camera, scene, geometries and the two shared programs are created a
 * single time. Category/outlet switches go through updateItems(), which only
 * rebinds pooled Media objects to new data — no GL resource is ever recreated.
 */
class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#1a1a1a',
      borderRadius = 0.05,
      scrollSpeed = 2.0,
      scrollEase = 0.07,
      onActiveIndexChange
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.onActiveIndexChange = onActiveIndexChange;
    this.lastActiveIndex = 0;

    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;

    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);

    this.imageTextureCache = new Map();
    this.titleTextureCache = new Map();
    this.mediaPool = [];
    this.medias = [];
    this.itemsLength = 0;
    this.currentItems = null;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createPrograms();

    this.updateItems(items);

    this.boundUpdate = this.update.bind(this);
    this.update();

    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
    this.titleGeometry = new Plane(this.gl);
  }
  createPrograms() {
    this.mediaProgram = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: MEDIA_VERTEX,
      fragment: MEDIA_FRAGMENT,
      uniforms: {
        tMap: { value: null },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uBorderRadius: { value: this.borderRadius },
        uOpacity: { value: 1.0 }
      },
      transparent: true
    });

    this.titleProgram = new Program(this.gl, {
      vertex: TITLE_VERTEX,
      fragment: TITLE_FRAGMENT,
      uniforms: {
        tMap: { value: null },
        uOpacity: { value: 1.0 }
      },
      transparent: true
    });
  }
  /** One texture per unique image URL, uploaded to the GPU exactly once. */
  getImageTexture(url) {
    let entry = this.imageTextureCache.get(url);
    if (!entry) {
      const texture = new Texture(this.gl, { generateMipmaps: true });
      entry = { texture, width: 0, height: 0 };
      this.imageTextureCache.set(url, entry);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        texture.image = img;
        entry.width = img.naturalWidth;
        entry.height = img.naturalHeight;
      };
    }
    return entry;
  }
  /** One rasterized metadata canvas per unique item content, generated exactly once. */
  getTitleTexture(item) {
    const variantKey = item.variants ? item.variants.map(v => `${v.label}:${v.price}`).join(',') : '';
    const key = `${item.id}|${item.title}|${item.price}|${item.category}|${item.isVeg}|${item.isChefSpecial}|${item.ingredients}|${variantKey}`;
    let texture = this.titleTextureCache.get(key);
    if (!texture) {
      texture = new Texture(this.gl, { generateMipmaps: false });
      texture.image = createCardMetadataCanvas(item, this.textColor);
      this.titleTextureCache.set(key, texture);
    }
    return texture;
  }
  updateItems(newItems) {
    this.currentItems = newItems;
    this.itemsLength = newItems.length;
    const tripled = newItems.concat(newItems).concat(newItems);

    // Grow the pool if this dataset needs more cards; never shrink, never destroy
    while (this.mediaPool.length < tripled.length) {
      this.mediaPool.push(new Media({ app: this }));
    }

    // Rebind pooled cards to the new dataset
    for (let i = 0; i < tripled.length; i++) {
      this.mediaPool[i].setItem(tripled[i], i, tripled.length);
    }
    // Park unused pool entries
    for (let i = tripled.length; i < this.mediaPool.length; i++) {
      this.mediaPool[i].hide();
    }
    this.medias = this.mediaPool.slice(0, tripled.length);

    // Reset scroll position exactly to the center copy of the items track
    if (this.medias[0]) {
      const width = this.medias[0].width;
      const initialScroll = this.itemsLength * width;
      this.scroll.current = initialScroll;
      this.scroll.target = initialScroll;
      this.scroll.last = initialScroll;
    }

    this.lastActiveIndex = 0;
    if (this.onActiveIndexChange) this.onActiveIndexChange(0);
  }
  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const pxToUnits = this.viewport.width / this.screen.width;
    const distance = (this.start - x) * pxToUnits * (this.scrollSpeed * 0.45);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }
  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    // Continuous trackpad & wheel input increments for fluid, buttery-smooth scrolling
    this.scroll.target += delta * 0.003;
    this.onCheckDebounce();
  }
  onKeyDown(e) {
    if (!this.medias[0]) return;
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += this.medias[0].width;
        this.onCheckDebounce();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= this.medias[0].width;
        this.onCheckDebounce();
        break;

      case 'Home':
        e.preventDefault();
        this.scroll.target = this.itemsLength * this.medias[0].width;
        this.onCheckDebounce();
        break;

      default:
        break;
    }
  }
  scrollTo(index) {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;

    const currentFloatIndex = this.scroll.target / width;
    const currentMediaIndex = Math.round(currentFloatIndex);

    const N = this.itemsLength;
    const currentBase = Math.floor(currentMediaIndex / N) * N;

    const targetMediaIndex = currentBase + index;
    const options = [targetMediaIndex - N, targetMediaIndex, targetMediaIndex + N];
    let bestOption = options[0];
    let minDiff = Math.abs(options[0] - currentFloatIndex);

    for (let k = 1; k < options.length; k++) {
      const diff = Math.abs(options[k] - currentFloatIndex);
      if (diff < minDiff) {
        minDiff = diff;
        bestOption = options[k];
      }
    }

    this.scroll.target = bestOption * width;
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(this.scroll.target / width);
    this.scroll.target = width * itemIndex;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize());
    }
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }

    if (this.medias && this.medias[0]) {
      const width = this.medias[0].width;
      const floatIndex = this.scroll.current / width;
      let activeMediaIndex = Math.round(floatIndex) % this.medias.length;
      if (activeMediaIndex < 0) activeMediaIndex += this.medias.length;

      const activeItemIndex = activeMediaIndex % this.itemsLength;

      if (this.onActiveIndexChange && this.lastActiveIndex !== activeItemIndex) {
        this.lastActiveIndex = activeItemIndex;
        this.onActiveIndexChange(activeItemIndex);
      }
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;

    this.raf = window.requestAnimationFrame(this.boundUpdate);
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: false });
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    this.container.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    this.container.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp);

    window.addEventListener('keydown', this.boundOnKeyDown);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);

    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    window.removeEventListener('keydown', this.boundOnKeyDown);

    if (this.container) {
      this.container.removeEventListener('wheel', this.boundOnWheel);
      this.container.removeEventListener('mousedown', this.boundOnTouchDown);
      this.container.removeEventListener('mousemove', this.boundOnTouchMove);
      this.container.removeEventListener('touchstart', this.boundOnTouchDown);
      this.container.removeEventListener('touchmove', this.boundOnTouchMove);
    }

    this.mediaPool.length = 0;
    this.medias.length = 0;

    if (this.planeGeometry) this.planeGeometry.remove();
    if (this.titleGeometry) this.titleGeometry.remove();
    if (this.mediaProgram) this.mediaProgram.remove();
    if (this.titleProgram) this.titleProgram.remove();

    this.imageTextureCache.forEach(entry => {
      if (entry.texture && entry.texture.texture) this.gl.deleteTexture(entry.texture.texture);
    });
    this.imageTextureCache.clear();
    this.titleTextureCache.forEach(texture => {
      if (texture && texture.texture) this.gl.deleteTexture(texture.texture);
    });
    this.titleTextureCache.clear();

    const loseContext = this.gl.getExtension('WEBGL_lose_context');
    if (loseContext) loseContext.loseContext();

    if (this.gl.canvas.parentNode) {
      this.gl.canvas.parentNode.removeChild(this.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 2,
  textColor = '#1a1a1a',
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.07
}) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeControls = useAnimation();

  useEffect(() => {
    if (!containerRef.current) return;

    if (!appRef.current) {
      appRef.current = new App(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        scrollSpeed,
        scrollEase,
        onActiveIndexChange: setActiveIndex
      });
    } else if (appRef.current.currentItems !== items) {
      appRef.current.updateItems(items);
    }
  }, [items, bend, textColor, borderRadius, scrollSpeed, scrollEase]);

  // Same 0.35s fade the gallery always had on item changes, but retriggered on the
  // stable container — the canvas host must never remount or the WebGL canvas is lost
  useEffect(() => {
    fadeControls.set({ opacity: 0 });
    fadeControls.start({ opacity: 1, transition: { duration: 0.35 } });
  }, [items, fadeControls]);

  useEffect(() => {
    return () => {
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
      }
    };
  }, []);

  const slidePrev = () => {
    if (appRef.current) {
      const nextIdx = (activeIndex - 1 + items.length) % items.length;
      appRef.current.scrollTo(nextIdx);
    }
  };

  const slideNext = () => {
    if (appRef.current) {
      const nextIdx = (activeIndex + 1) % items.length;
      appRef.current.scrollTo(nextIdx);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between relative overflow-visible">
      {/* Navigation Arrows for Desktop Screen */}
      {items.length > 1 && (
        <div className="hidden md:block">
          <button
            onClick={slidePrev}
            className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-brand-charcoal/10 bg-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="Previous Item"
          >
            <ChevronLeft size={20} className="text-brand-charcoal" />
          </button>
          <button
            onClick={slideNext}
            className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-brand-charcoal/10 bg-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="Next Item"
          >
            <ChevronRight size={20} className="text-brand-charcoal" />
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={fadeControls}
        className="circular-gallery flex-grow"
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Circular image gallery. Use left and right arrow keys to navigate."
      />

      {/* Pagination Indicators / Dots */}
      {items.length > 1 && (
        <div className="flex gap-2 items-center justify-center mt-4 shrink-0 z-20 relative">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (appRef.current) {
                  appRef.current.scrollTo(i);
                }
              }}
              className={`rounded-full transition-all duration-300 h-1.5 ${i === activeIndex
                  ? "w-5 bg-brand-red"
                  : "w-1.5 bg-brand-charcoal/20 hover:bg-brand-charcoal/40"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
