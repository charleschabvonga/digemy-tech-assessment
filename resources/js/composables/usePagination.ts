import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export interface PaginationMeta {
  current_page: number
  last_page: number
  from?: number | null
  to?: number | null
  total?: number | null
  per_page?: number | null
  prev_page_url?: string | null
  next_page_url?: string | null
  links?: PaginationLinkMap[]
}

export interface PaginationLinkMap {
  prev?: string | null
  next?: string | null
  [key: string]: unknown
}

export interface PaginationPayload {
  meta?: Partial<PaginationMeta> & { per_page?: number }
  links?: PaginationLinkMap | PaginationLinkMap[]
  current_page?: number
  last_page?: number
  from?: number
  to?: number
  total?: number
  per_page?: number
  prev_page_url?: string | null
  next_page_url?: string | null
}

export function usePagination(routeName: string, defaultPerPage = 5) {
  const router = useRouter()
  const route = useRoute()

  const pagination = ref<PaginationMeta | null>(null)
  const perPage = ref<number>(defaultPerPage)

  const visiblePages = computed<number[]>(() => {
    if (!pagination.value) return []

    const current = pagination.value.current_page
    const last = pagination.value.last_page
    const pages: number[] = []

    let start = Math.max(1, current - 2)
    let end = Math.min(last, current + 2)

    if (end - start < 4) {
      end = Math.min(last, start + 4)
    }

    if (end - start < 4) {
      start = Math.max(1, end - 4)
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i)
    }

    return pages
  })

  function goToPage(page: number): void {
    if (page < 1 || (pagination.value && page > pagination.value.last_page)) return

    router.push({
      name: routeName,
      query: { ...route.query, page, per_page: perPage.value },
    })
  }

  function handlePerPageChange(): void {
    router.push({
      name: routeName,
      query: { ...route.query, page: 1, per_page: perPage.value },
    })
  }

  function getCurrentPage(): number {
    return parseInt(String(route.query.page || ''), 10) || 1
  }

  function getCurrentPerPage(): number {
    return parseInt(String(route.query.per_page || ''), 10) || defaultPerPage
  }

  function initializePerPage(): void {
    const routePerPage = getCurrentPerPage()
    if (routePerPage !== perPage.value) {
      perPage.value = routePerPage
    }
  }

  function setPagination(data: PaginationPayload): void {
    const meta = data.meta || {}
    const rawLinks = data.links

    let prevPageUrl = data.prev_page_url ?? null
    let nextPageUrl = data.next_page_url ?? null
    let normalizedLinks: PaginationLinkMap[] = []

    if (Array.isArray(rawLinks)) {
      normalizedLinks = rawLinks
    } else if (rawLinks && typeof rawLinks === 'object') {
      prevPageUrl = rawLinks.prev ?? prevPageUrl
      nextPageUrl = rawLinks.next ?? nextPageUrl
    }

    pagination.value = {
      current_page: meta.current_page ?? data.current_page ?? 1,
      last_page: meta.last_page ?? data.last_page ?? 1,
      from: meta.from ?? data.from ?? null,
      to: meta.to ?? data.to ?? null,
      total: meta.total ?? data.total ?? null,
      per_page: meta.per_page ?? data.per_page ?? perPage.value,
      prev_page_url: prevPageUrl,
      next_page_url: nextPageUrl,
      links: normalizedLinks,
    }

    const perPageValue = meta.per_page ?? data.per_page
    if (perPageValue && perPageValue !== perPage.value) {
      perPage.value = perPageValue
    }
  }

  function watchRouteQuery(onChange: (page: number, perPageValue: number) => void): void {
    watch(
      [() => route.query.page, () => route.query.per_page],
      ([newPage, newPerPage], [oldPage, oldPerPage]) => {
        const newPageNum =
          parseInt(newPage != null ? String(newPage) : '', 10) || 1
        const oldPageNum =
          parseInt(oldPage != null ? String(oldPage) : '', 10) || 1
        const newPerPageNum =
          parseInt(newPerPage != null ? String(newPerPage) : '', 10) ||
          defaultPerPage
        const oldPerPageNum =
          parseInt(oldPerPage != null ? String(oldPerPage) : '', 10) ||
          defaultPerPage

        if (newPageNum !== oldPageNum || newPerPageNum !== oldPerPageNum) {
          if (newPerPageNum !== oldPerPageNum) {
            perPage.value = newPerPageNum
          }
          onChange(newPageNum, newPerPageNum)
        }
      },
    )
  }

  return {
    pagination,
    perPage,
    visiblePages,
    goToPage,
    handlePerPageChange,
    getCurrentPage,
    getCurrentPerPage,
    initializePerPage,
    setPagination,
    watchRouteQuery,
  }
}


