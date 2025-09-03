# The Anatomy Of A Feature

> There are only two hard problems in software development - Naming things, and figuring out where to put them
> 

Historically, front-end projects have lacked clear guidelines for solving these problems. Over time, we have gradually developed our code organization into a mix of unwritten rules and patterns. The goal of this document is to formalize and document these findings.

<aside>
💡 A screenshot representing the full picture of all of the rules and patterns outlined below

</aside>

![Screenshot 2024-08-02 at 3.08.16 PM.png](The%20Anatomy%20Of%20A%20Feature%2080125c979d934411ac12424e2a632ce2/05ffb730-5017-42a5-9984-a50e03b99880.png)

## File extensions

Every new file that you create that includes javascript code should use the .ts extension (or .tsx  for files including JSX). This is required as a part of our broader initiative to reach 100% typescript coverage on the front-end.

## File names

There are a few rules to keep in mind when it comes to naming files.

### `{ExportedComponentName}.tsx`

If you’re creating a file that represents a React component, the file name should always match the exported component name in CamelCase format. For example:

```jsx
// filename: GraviButton.tsx

export function GraviButton() {
	// ...
}
```

### `index.(ts|tsx)`

For small components with no child dependencies, we use the CamelCasing convention. But what about larger components? In these cases, all components are grouped in a folder named after the parent component. The file representing the parent component is named `index.tsx`, and all its child components are in a folder called `components`. This organization pattern is recursive and can be used in the sub-components folder if a child component is not atomic and can be further broken down.

Example TodoList scenario:

- TodoList
    - components
        
        `ListFilters.tsx`
        
        `ListHeader.tsx`
        
        `TodoItem.tsx`
        
    
    `index.tsx`
    
    `TodoList.types.ts`
    
    `TodoList.styles.css`
    
    `TodoList.test.ts` 
    
      
    

### `page.tsx`

This name should always be used for React components that represent the top level page that is referenced in the site’s `pageConfig.ts` configuration file and live in the pages directory (which will be discussed in more detail further down)

### `columnDefs.ts(tsx)`

As a default, we break out column definitions for components that render GravGrids into their own file that live as a sibling file next the grid. 

- OrderDispatch
    - Grid
        
        `columnDefs.ts(tsx)` - will be tsx if React is utilized for custom cell editors / renderers
        
        `index.tsx` - the grid component that imports the column definitions
        
         
        
    

`*.types.ts` 

`*.test.ts`

## So where should new things go?

Every body of work that we absorb and drive to completion will fall into one of three buckets. You’re either working on a new page, a new component to an existing page, or a new component  

### 📦 Components

Components used across two or more pages are considered 'global' and should live in this directory. This typically includes things like shared cell renderers and editors for grids, date pickers, etc. but this can extend to more nuanced components for pages with similar functionality. 

<aside>
💡

The recursive folder structure discussed earlier also applies to components in this directory. If it is large enough and can be broken down into smaller, testable units the same pattern should be used.

</aside>

### 📖 Pages

![Screenshot 2024-09-22 at 9.19.48 AM.png](The%20Anatomy%20Of%20A%20Feature%2080125c979d934411ac12424e2a632ce2/Screenshot_2024-09-22_at_9.19.48_AM.png)

- Order Management
    - All
        
        `/components`
        
        `page.tsx` 
        
        `types.ts`
        
        `styles.ts` 
        
    - CarrierDispatch
        
        `/components`
        
        `page.tsx`
        
    - OrderDispatch
        
        `/components`
        
        `page.tsx`
        
        - 

The pages directory is a 1:1 hierarchical mirror of the site’s navigation. Today, we are pretty disorganized in this area, and it’s hard to tell at a glance if something is a component or actual page that is referenced in the site’s page config.

Two things will now make the distinction very clear. If it’s a page..:

1. It has to live in this root level pages directory
2. The file exporting the page’s react component will be called `page.tsx`

That leaves every other component in one of two places. It’s either reusable and lives at the root level components directory, or it’s usage is specific to a page and it lives somewhere in the sub components folder of that page. 

This makes finding finding pages or components within pages trivial for new developers or individuals who just don’t have the full mental picture of the codebase yet. For example: You might be making a change to the Order Requests grid, but you’ve never touched that component and aren’t sure where it’s at. Just would just follow the navigation structure in this directory until you find it. 

Site Navigation:

`Order Management -> Order Requests` 

Location in code:

`OrderManagement\OrderRequests\components\Grid\index.tsx`  

This pattern aims to align the mental models of site navigation and codebase structure, making it intuitive for developers to locate components within the project. 

### 🛜 API

Today, our data access layer is implemented using custom hooks built on top of `@tanstack/react-query` . Each folder in this directory represents a grouping of API endpoints that are loosely centered around a single feature in the software. Things like `useLoadNumbers`, `useDeliveryRequests`, etc.

Inside each folder you’ll find 

- useDeliveryRequests
    
    `index.ts`  - The file exporting the custom hook
    
    `schema.types.ts` - A place to keep request / response types for the endpoints
    

The hook implementation itself is pretty straight forward, and almost all of them have a very similar structure:

1.  A call to `useApi` is found at the top (if the hook is hitting authenticated routes).
2. An instance of the global QueryClient object is referenced. This is used for optimistic updates across query caches.
3. A list of wrapper functions will follow that implement the various CRUD operations needed. Depending on how the endpoint is accessing data (read / update), these will either be a call to useQuery or useMutation.
4. An object is returned from the hook that includes these query / mutation wrappers.

This creates a ‘slice’ of our API that pages / components can use a-la-carte. 

- ℹ️ Real example from our codebase.. (useDeliveryRequests)
    
    ```tsx
    import { useApi } from '@gravitate-js/the-armory'
    import { getAPIURL } from '@utils/api'
    import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
    import { UpsertRequest, DeliveryRequestOverviewRequest } from './types/schema.ts'
    
    export const useDeliveryRequests = () => {
    
    	// `baseURLOverride` is rarely changed..
    	// but the flexibility is there to hit a service other than 
    	// our backend API if needed.
      const api = useApi({ baseURLOverride: getAPIURL() })
      
      // A handle to the global query client. Useful for invalidating caches
      // across queries / mutations (FE side effects)
      const queryClient = useQueryClient()
      
      // EX: POST test.bb.gravitate.energy/api/delivery_requests/overview
      // - Will dynamically re-run when filters change 🧙🏼‍♂️
      function useDeliveryRequestsQuery(filters: DeliveryRequestOverviewRequest) {
        return useQuery(['deliveryRequestsQuery', filters], () => api.post('delivery_request/overview', filters), {
          enabled: !!filters,
        })
    	}
    
    	  
      // EX: POST test.bb.gravitate.energy/api/delivery_requests/upsert
      // - Creates or updates a delivery request, then optimistcally..
      // inserts or updates it in the overview query cache without needing
      // to hit the endpoint again 🪄
      const upsertRequestMutation = useMutation(
        ['upsertRequestMutation'],
        (request: UpsertRequest) => api.post(`delivery_request/upsert`, request),
        {
          onSuccess: async (response, request) => {
            queryClient.setQueriesData(['deliveryRequestsQuery'], (oldData) => {
              if (!request.id) {
                return {
                  ...oldData,
                  rows: [response, ...oldData.rows],
                }
              }
              return {
                ...oldData,
                rows: oldData.rows.map((row) => (response.id === row.id ? { ...row, ...response } : row)),
              }
            })
          },
        }
      )
    
      const cancelRequestMutation = useMutation(
        ['cancelRequestMutation'],
        (payload: { id: string; note: string }) =>
          api.post(`delivery_request/cancel`, { request_id: payload.id, note: payload.note }),
        {
          onSuccess: async (response, request) => {
    	      // This works.., but it's the bad lazy approach and will require
    	      // hitting the endpoint again. We'd rather just update the row in
    	      // place that was changed. 😵
            await queryClient.invalidateQueries(['deliveryRequestsQuery'])
          },
        }
      )
    
    	// The api 'slice' for delivery requests that consumers can use 
      return {
        getDeliveryRequestsQuery,
        upsertRequestMutation,
        cancelRequestMutation,
      }
    }
    
    ```
    

One thing that might look odd here is the useQuery implementation. Instead of returning the result of useQuery directly, we’re instead returning a *function* that will return the result of useQuery. Seems like a needless step, but this actually buys us two things. 

1. It lets us pass in dependencies that the query might need. This lets the query rerun automatically when those dependencies change upstream. (eg: An overview endpoint that lets you narrow results through query params)
2. A page or component might only need the mutation functions from the hook. Structuring the queries this way allows the consumers the pull off what they need without triggering the query and wasting a network request. 

### 🖼️ Assets

The assets folder includes non typescript assets like logos, icons, global stylesheets, and animation json files. This one should be pretty self explanatory. 

### 🪝 Hooks

Any global hooks that have functionality outside of a feature 

### 🛠️ Utils

Common utility functions and constants live here. Things like sorting functions, date / time & number formatters, etc. 

## Deprecated Folders & Patterns