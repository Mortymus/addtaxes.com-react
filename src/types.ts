export interface Province {
  provinceName: string;
  gst: number;
  pst: number;
  hst: number;
}

export interface Amount {
    baseAmount: number;
    gstAmount: number;
    pstAMount: number;
    hstAmount: number;
    tipAmount: number;
    totalAmount: number;
}