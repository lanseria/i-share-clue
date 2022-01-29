export const addOptions = [
  {
    label: '封控区',
    key: 0,
    color: '#ba4e41',
  },
  {
    label: '管控区',
    key: 1,
    color: '#e49a83',
  },
  {
    label: '防范区',
    key: 2,
    color: '#eccfb1',
  },
];
export const commonStyle = {
  strokeOpacity: 1,
  fillOpacity: 0.5,
  strokeColor: '#ffffff',
  strokeWeight: 1,
  strokeStyle: 'dashed',
  strokeDasharray: [5, 5],
};
export interface OverlayItem {
  name: string;
  key: number;
  show: boolean;
}
export const setPolygonOpt = (polygon: any, area: any) => {
  const typeColorMap = {
    0: '#ba4e41',
    1: '#e49a83',
    2: '#eccfb1',
  };
  polygon.setOptions({
    // @ts-ignore
    fillColor: typeColorMap[area.type],
    ...commonStyle,
  });
  polygon.setOptions({
    path: area.path,
    extData: area,
  });
  polygon.on('mouseover', () => {
    polygon.setOptions({
      fillOpacity: 0.7,
      fillColor: '#7bccc4',
    });
  });
  polygon.on('mouseout', () => {
    polygon.setOptions({
      fillOpacity: 0.5,
      // @ts-ignore
      fillColor: typeColorMap[area.type],
    });
  });
};
