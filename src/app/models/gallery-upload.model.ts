export class GalleryItem {
  constructor(
    public filePath?: string,
    public _xlPath?: string,
    public _lgPath?: string,
    public _smPath?: string,
    public _mdPath?: string,
    public fileName?: string,
    public upTime?: number,
    public album?: string,
    public desc?: string,
    public uid?: string,
  ) {
    const Obj = {
      filePath: filePath || null,
      fileName: fileName || null,
      upTime: upTime || null,
      album: album || null,
      desc: desc || null,
      uid: uid || null
    };
    return Obj;
  }
}

export class GalleryUploadObject {
  constructor(
    public file?: File,
    public blobVal?: any,
    public fileName?: string,
    public ext?: string,
    public size?: number,
    public type?: string,
    public uploadObj?: GalleryItem,
    public uploadStatus?: 'loaded' | 'uploading' | 'failed' | 'completed',
    public uploadPerc?: number,
    public metaData?: FileMetaData
  ) {
    const Obj = {
      file: file || null,
      blobVal: blobVal || null,
      fileName: fileName || null,
      ext: ext || null,
      size: size || null,
      type: type || null,
      uploadStatus: uploadStatus || 'loaded',
      uploadPerc: uploadPerc || 0,
      uploadObj: uploadObj || new GalleryItem(),
      metaData: metaData || null
    };
    return Obj;
  }
}

export class FileMetaData {
  constructor(
    public type?: string,
    public size?: number,
    public width?: number,
    public height?: number
  ) {
    const Obj = {
      type: type || null,
      size: size || null,
      width: width || null,
      height: height || null
    };
    return Obj
  }
}
export interface ISize { width: number; height: number; }


export class PhotoObject {
  constructor(
    public filePath?: string,
    public fileName?: string,
    public upTime?: number,
    public parentPath?: string,
    public _smPath?: string,
    public _mdPath?: string,
    public _lgPath?: string,
    public _xlPath?: string
  ) {
    const Obj = {
      filePath: filePath || null,
      fileName: fileName || null,
      upTime: upTime || null,
      parentPath: parentPath || null,
      _smPath: _smPath || null,
      _mdPath: _mdPath || null,
      _lgPath: _lgPath || null,
      _xlPath: _xlPath || null
    };
    return Obj;
  }
}

export class EventBannerUploadObj {
  constructor(
    public file?: File,
    public blobVal?: any,
    public fileName?: string,
    public ext?: string,
    public size?: number,
    public type?: string,
    public uploadObj?: PhotoObject,
    public uploadStatus?: 'loaded' | 'uploading' | 'failed' | 'completed',
    public uploadPerc?: number,
    public metaData?: FileMetaData
  ) {
    const Obj = {
      file: file || null,
      blobVal: blobVal || '/assets/img/placeholders/product_image_thumbnail_placeholder.png',
      fileName: fileName || null,
      ext: ext || null,
      size: size || null,
      type: type || null,
      uploadStatus: uploadStatus || 'loaded',
      uploadPerc: uploadPerc || 0,
      uploadObj: uploadObj || new PhotoObject(),
      metaData: metaData || null
    };
    return Obj;
  }
}

export class Album {
  constructor(
    public albumTitle?: string,
    public lastUpdateTime?: number,
    public items?: GalleryItem[]
  ) {
    const Obj = {
      albumTitle: albumTitle || null,
      lastUpdateTime: lastUpdateTime || null,
      items: items || []
    };
    return Obj;
  }
}