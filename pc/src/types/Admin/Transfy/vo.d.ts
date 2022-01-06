interface TransfyFormVO {
  name: string;
  url: string;
  engineModelType: string;
}

interface TransfyVO extends TransfyFormVO {
  id: string;
  posterUrl: string;
  type: string;
  status: string;
}
