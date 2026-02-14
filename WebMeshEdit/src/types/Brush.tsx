export interface BrushSettings {
  color: string;
  size: number;
  mode: 'paint' | 'orbit';
  textureUrl?: string | null;
}
