# Frontend data architecture plan

This project uses a deliberately small data stack:

1. `src/services/api.ts` owns Axios configuration and interceptors.
2. `src/services/api.repository.ts` exposes typed GET, POST, PUT, PATCH, and DELETE methods.
3. `src/services/<domain>/<domain>.service.ts` declares explicit backend endpoints for one domain.
4. Screens use TanStack Query for server state, loading/error state, caching, and invalidation.

TanStack Query does not replace the API service. The service describes how to call the backend;
TanStack Query describes when to call it and how its server state is cached.

## Request and error rules

- The request interceptor reads the current i18n language for every request and sends it as
  `Accept-Language`, so changing language applies immediately without rebuilding clients.
- Authenticated requests attach the current access token.
- A 401 gets one shared refresh attempt and one retry. An invalid refresh clears the session.
- Backend problem details are the source of user-facing validation and domain messages.
- Local fallback messages are used only when the backend cannot respond.
- Services return DTOs and throw `ApiError`; they do not show UI, translate backend messages, or
  manage component state.

## Domain service convention

Use one service file per backend domain, not one file per request:

```ts
const recipesRepository = new ApiRepository('/api/recipes');

export const recipeService = {
  list: (params: RecipeListParams, signal?: AbortSignal) =>
    recipesRepository.get<RecipeListResponse>('', { params, signal }),
  getById: (id: string, signal?: AbortSignal) =>
    recipesRepository.get<RecipeResponse>(id, { signal }),
  create: (request: CreateRecipeRequest) =>
    recipesRepository.post<RecipeResponse, CreateRecipeRequest>('', request),
  replace: (id: string, request: ReplaceRecipeRequest) =>
    recipesRepository.put<RecipeResponse, ReplaceRecipeRequest>(id, request),
  update: (id: string, request: UpdateRecipeRequest) =>
    recipesRepository.patch<RecipeResponse, UpdateRecipeRequest>(id, request),
  remove: (id: string) => recipesRepository.delete<void>(id),
};
```

Endpoint paths live only in the domain service. Screens never call Axios or construct API URLs.

## TanStack Query convention

Every cached domain gets a stable query-key factory:

```ts
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (params: RecipeListParams) => [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};
```

Reads use `useQuery` and forward its cancellation signal:

```ts
useQuery({
  queryKey: recipeKeys.list(params),
  queryFn: ({ signal }) => recipeService.list(params, signal),
});
```

Writes use `useMutation`. After success, invalidate only the affected keys and await invalidation so
the mutation stays pending until the visible data is current:

```ts
const queryClient = useQueryClient();

useMutation({
  mutationKey: ['recipes', 'create'],
  mutationFn: recipeService.create,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: recipeKeys.lists() }),
});
```

## Delivery sequence for many endpoints

For each backend domain:

1. Add request/response DTOs matching the backend contract exactly.
2. Add explicit methods to that domain service using `ApiRepository`.
3. Add query keys only for cached GET endpoints.
4. Add query or mutation hooks/options only when a screen needs the endpoint.
5. Design loading, error, empty, and content states.
6. Add targeted contract tests for path, method, payload, headers, and invalidation.
7. Run TypeScript, lint, Expo Doctor, and a production bundle before merging.

Avoid speculative generic abstractions. Add pagination, optimistic updates, persistence, or offline
queues only when a real endpoint requires them.

Reference: https://tanstack.com/query/latest/docs/framework/react/overview
