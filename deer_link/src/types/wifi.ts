// WiFi Related Types

export interface WiFiNetwork {
  ssid: string;
  signal: 'strong' | 'medium' | 'weak';
  isConnected: boolean;
  securityType?: string;
}

export interface MerchantInfo {
  id: string;
  name: string;
  category: string;
  distance: number;
  offer?: string;
  logo?: string;
}
