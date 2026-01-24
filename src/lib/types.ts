export type Icon = {
    id: number;
    data: string;
    mime_type: string
}

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
    user_id: number | string;
    feed_url: string;
    site_url: string;
    title: string;
    description: string;
    checked_at: string; // ISO 8601 datetime string
    next_check_at: string; // ISO 8601 datetime string

    // Fields, that may be an empty strings or null
    etag_header: string | null; 
    last_modified_header: string | null;
    parsing_error_message: string | null;
    parsing_error_count: number;
    scraper_rules: string | null;
    rewrite_rules: string | null;
    crawler: boolean;
    blocklist_rules: string | null;
    keeplist_rules: string | null;
    block_filter_entry_rules: string | null;
    keep_filter_entry_rules: string | null;
    urlrewrite_rules: string | null;

    // Fields for auuth/settings
    user_agent: string | null;
    cookie: string | null; // Нове поле
    username: string | null;
    password: string | null;

    // booleans
    disabled: boolean;
    no_media_player: boolean; // Нове поле
    ignore_http_cache: boolean;
    allow_self_signed_certificates: boolean; // Нове поле
    fetch_via_proxy: boolean;
    hide_globally: boolean;
    disable_http2: boolean; // Нове поле

    // notification settings
    apprise_service_urls: string | null; // Нове поле
    webhook_url: string | null; // Нове поле
    ntfy_enabled: boolean; // Нове поле
    ntfy_priority: number; // Нове поле
    ntfy_topic: string | null; // Нове поле
    pushover_enabled: boolean; // Нове поле
    pushover_priority: number; // Нове поле
    proxy_url: string | null; // Нове поле

    // nested objects
    category: FeedCategory;
    icon: FeedIcon;
};

export type createFeed = {
    // Required Field
    feed_url: string;

    // Optional Fields
    category_id?: number;
    username?: string;
    password?: string;
    crawler?: boolean;
    user_agent?: string;
    scraper_rules?: string;
    rewrite_rules?: string;
    blocklist_rules?: string;
    keeplist_rules?: string;
    disabled?: boolean;
    ignore_http_cache?: boolean;
    // fetch_via_proxy?: boolean;
};

export interface updateFeed extends createFeed {
    site_url: string;
    title: string;
}