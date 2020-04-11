export class FancyGalleryItem {
  constructor(
    public src: string,
    public opts?: FancyGalleryItemOptions,
  ) {
    const Obj = {src: src || null, opts: opts};
    return Obj;
  }
}

export class FancyGalleryItemOptions {
  constructor(
    public thumb?: string,
    public caption?: string
  ) {
    let Obj = {
      thumb: thumb, caption: caption
    };
    return Obj;
  }
}