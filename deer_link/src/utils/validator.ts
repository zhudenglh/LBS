// Input Validation Utilities

export function validatePostTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'discover.validation.title_empty' };
  }
  if (title.length > 100) {
    return { valid: false, error: 'common.validation.too_long' };
  }
  return { valid: true };
}

export function validatePostContent(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'discover.validation.content_empty' };
  }
  if (content.length > 500) {
    return { valid: false, error: 'common.validation.too_long' };
  }
  return { valid: true };
}

export function validateNickname(nickname: string): { valid: boolean; error?: string } {
  if (!nickname || nickname.trim().length === 0) {
    return { valid: false, error: 'profile.edit.nickname_empty' };
  }
  if (nickname.length > 20) {
    return { valid: false, error: 'common.validation.too_long' };
  }
  return { valid: true };
}

export function validateImageSize(sizeInBytes: number, maxSize: number): boolean {
  return sizeInBytes <= maxSize;
}
