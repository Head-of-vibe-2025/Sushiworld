# Webflow Service

This service handles communication with the Webflow CMS via a secure Supabase Edge Function.

## Usage

```typescript
import { webflowService } from './webflowService';

// Get all menu items for a region
const items = await webflowService.getMenuItems('BE');

// Get items filtered by category
const nigiri = await webflowService.getMenuItems('BE', 'category-id');

// Get a single item
const item = await webflowService.getMenuItem('item-id');

// Get categories
const categories = await webflowService.getCategories();
```

## With React Query (Recommended)

```typescript
import { useMenuItems, useMenuItem } from '../../hooks/useFoxyProducts';

// In your component
function MenuScreen() {
  const { data, isLoading, error } = useMenuItems();
  
  // data contains menu items
  // isLoading is true while fetching
  // error contains any error that occurred
}
```

## Architecture

```
Mobile App
    ↓ (calls)
webflowService.ts
    ↓ (HTTPS request)
Supabase Edge Function
    ↓ (secure API call)
Webflow API
```

## Security

- Webflow API token is stored server-side only
- Never exposed to the mobile app
- Edge Function acts as a secure proxy
- Uses Supabase authentication

## Caching

- React Query caches responses for 5 minutes
- Reduces API calls and improves performance
- Automatic background refetching
- Manual refetch available via pull-to-refresh

## Error Handling

The service throws errors that can be caught:

```typescript
try {
  const items = await webflowService.getMenuItems('BE');
} catch (error) {
  console.error('Failed to load menu:', error.message);
}
```

With React Query, errors are handled automatically:

```typescript
const { data, error } = useMenuItems();

if (error) {
  return <Text>Error: {error.message}</Text>;
}
```

## Response Format

### Menu Item
```typescript
{
  id: string;
  name: string;
  code: string;
  price: number;
  description?: string;
  image?: string;
  categoryId?: string;
  region?: string;
  isAvailable?: boolean;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  code: string;
  description?: string;
}
```

## Configuration

Set these environment variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing

Test the service directly:

```typescript
import { webflowService } from './webflowService';

// Test in a component or script
const testService = async () => {
  try {
    const items = await webflowService.getMenuItems('BE');
    console.log('Menu items:', items);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Related Files

- `src/types/webflow.types.ts` - TypeScript types
- `src/hooks/useFoxyProducts.ts` - React Query hooks
- `supabase/functions/webflow-menu/index.ts` - Edge Function

