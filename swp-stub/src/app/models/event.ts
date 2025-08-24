export type MainauEvent = {
  id: number,
  title?: string, //title is optional because parsing title only (no date info in title) errors otherwise
  start_date: string,
  end_date: string,
  whole_date?: string,
  location?: string,
  picture: string,
  price: number,
  description?: string,
  description_html?: string,
  coordinates_lat?: number,
  coordinates_lng?: number,
  isFav?: boolean,
  prices?: { category: string, price: number }[];
}

export type NewEvent = Partial<MainauEvent>
