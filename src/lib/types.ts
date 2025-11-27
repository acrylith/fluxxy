export type FeedIcon = {
  feed_id: number;
  icon_id: number;
  mime_type?: string;
  external_icon_id: string;
};

export type FeedCategory = {
  id: number;
  title: string;
  user_id: number;
  hide_globally: boolean;
};

export type Feed = {
  id: number;
  user_id: number;
  feed_url: string;
  site_url: string;
  title: string;
  description: string;
  checked_at: string; // ISO 8601 datetime string
  next_check_at: string; // ISO 8601 datetime string
  
  // Поля, які можуть бути порожніми рядками або null в API
  etag_header: string | null; 
  last_modified_header: string | null;
  parsing_error_message: string | null;
  parsing_error_count: number;
  scraper_rules: string | null;
  rewrite_rules: string | null;
  crawler: boolean;
  blocklist_rules: string | null;
  keeplist_rules: string | null;
  
  // НОВІ поля
  block_filter_entry_rules: string | null;
  keep_filter_entry_rules: string | null;
  urlrewrite_rules: string | null;
  
  // Поля для аутентифікації/налаштувань
  user_agent: string | null;
  cookie: string | null; // Нове поле
  username: string | null;
  password: string | null;
  
  // Булеві налаштування
  disabled: boolean;
  no_media_player: boolean; // Нове поле
  ignore_http_cache: boolean;
  allow_self_signed_certificates: boolean; // Нове поле
  fetch_via_proxy: boolean;
  hide_globally: boolean;
  disable_http2: boolean; // Нове поле

  // Налаштування сповіщень
  apprise_service_urls: string | null; // Нове поле
  webhook_url: string | null; // Нове поле
  ntfy_enabled: boolean; // Нове поле
  ntfy_priority: number; // Нове поле
  ntfy_topic: string | null; // Нове поле
  pushover_enabled: boolean; // Нове поле
  pushover_priority: number; // Нове поле
  proxy_url: string | null; // Нове поле

  // Вкладені об'єкти
  category: FeedCategory;
  icon: FeedIcon;
};