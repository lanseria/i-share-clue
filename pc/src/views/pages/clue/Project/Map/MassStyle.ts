export const massStyle = ($Amap: any) => {
  return [
    {
      url: 'https://webapi.amap.com/images/mass/mass0.png',
      anchor: new $Amap.Pixel(6, 6),
      size: new $Amap.Size(11, 11),
      zIndex: 3,
    },
    {
      url: 'https://webapi.amap.com/images/mass/mass1.png',
      anchor: new $Amap.Pixel(4, 4),
      size: new $Amap.Size(7, 7),
      zIndex: 2,
    },
    {
      url: 'https://webapi.amap.com/images/mass/mass2.png',
      anchor: new $Amap.Pixel(3, 3),
      size: new $Amap.Size(5, 5),
      zIndex: 1,
    },
  ];
};
