export type Ticket = {
  event_id: number,
  title?: string;
  picture: string;
  start_date: string;
  end_date: string;
  whole_date?: string;
  amounts: [{
    category: string,
    amount: number
  }]
}