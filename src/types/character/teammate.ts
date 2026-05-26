import type { SharedCharacterPreviewDTO } from './share.js'

/** @deprecated Renamed to {@link SharedCharacterPreviewDTO}; will be removed in next major. */
export type TeammatePreviewDTO = SharedCharacterPreviewDTO

/** @deprecated Endpoint renamed to POST /share/characters/resolve; use ResolveSharedCharactersBody. Removed in next major. */
export interface ValidateTeammatesBody {
  shareIds: string[]
}

/** @deprecated Endpoint renamed to POST /share/characters/resolve; use ResolveSharedCharactersResponse. Removed in next major. */
export interface ValidateTeammatesResponse {
  teammates: SharedCharacterPreviewDTO[]
}
