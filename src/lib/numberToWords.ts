export function numberToWords(numInput: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numStr = numInput.toString();
  if (numStr.length > 9) return 'overflow';
  
  const n = ('000000000' + numStr).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; 
  
  let str = '';
  const n1 = parseInt(n[1]);
  str += (n1 !== 0) ? (a[n1] || b[parseInt(n[1][0])] + ' ' + a[parseInt(n[1][1])]) + 'Crore ' : '';
  
  const n2 = parseInt(n[2]);
  str += (n2 !== 0) ? (a[n2] || b[parseInt(n[2][0])] + ' ' + a[parseInt(n[2][1])]) + 'Lakh ' : '';
  
  const n3 = parseInt(n[3]);
  str += (n3 !== 0) ? (a[n3] || b[parseInt(n[3][0])] + ' ' + a[parseInt(n[3][1])]) + 'Thousand ' : '';
  
  const n4 = parseInt(n[4]);
  str += (n4 !== 0) ? (a[n4] || b[parseInt(n[4][0])] + ' ' + a[parseInt(n[4][1])]) + 'Hundred ' : '';
  
  const n5 = parseInt(n[5]);
  str += (n5 !== 0) ? ((str !== '') ? 'and ' : '') + (a[n5] || b[parseInt(n[5][0])] + ' ' + a[parseInt(n[5][1])]) + 'only' : 'only';
  
  return str.trim();
}
