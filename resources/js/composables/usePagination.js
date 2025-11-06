import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function usePagination(routeName, defaultPerPage = 5) {
  const router = useRouter()
  const route = useRoute()
  
  const pagination = ref(null)
  const perPage = ref(defaultPerPage)
  
  const visiblePages = computed(() => {
    if (!pagination.value) return []
    
    const current = pagination.value.current_page
    const last = pagination.value.last_page
    const pages = []
    
    let start = Math.max(1, current - 2)
    let end = Math.min(last, current + 2)
    
    if (end - start < 4) {
      end = Math.min(last, start + 4)
    }
    
    if (end - start < 4) {
      start = Math.max(1, end - 4)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  })
  
  function goToPage(page) {
    if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
    
    router.push({
      name: routeName,
      query: { ...route.query, page, per_page: perPage.value }
    })
  }
  
  function handlePerPageChange() {
    router.push({
      name: routeName,
      query: { ...route.query, page: 1, per_page: perPage.value }
    })
  }
  
  function getCurrentPage() {
    return parseInt(route.query.page) || 1
  }
  
  function getCurrentPerPage() {
    return parseInt(route.query.per_page) || defaultPerPage
  }
  
  function initializePerPage() {
    const routePerPage = getCurrentPerPage()
    if (routePerPage !== perPage.value) {
      perPage.value = routePerPage
    }
  }
  
  function setPagination(data) {
    const meta = data.meta || {}
    const links = data.links || {}
    
    pagination.value = {
      current_page: meta.current_page || data.current_page,
      last_page: meta.last_page || data.last_page,
      from: meta.from || data.from,
      to: meta.to || data.to,
      total: meta.total || data.total,
      per_page: meta.per_page || data.per_page,
      prev_page_url: links.prev || data.prev_page_url,
      next_page_url: links.next || data.next_page_url,
      links: Array.isArray(links) ? links : []
    }
    
    const perPageValue = meta.per_page || data.per_page
    if (perPageValue && perPageValue !== perPage.value) {
      perPage.value = perPageValue
    }
  }
  
  function watchRouteQuery(onChange) {
    watch([() => route.query.page, () => route.query.per_page], ([newPage, newPerPage], [oldPage, oldPerPage]) => {
      const newPageNum = parseInt(newPage) || 1
      const oldPageNum = parseInt(oldPage) || 1
      const newPerPageNum = parseInt(newPerPage) || defaultPerPage
      const oldPerPageNum = parseInt(oldPerPage) || defaultPerPage
      
      if (newPageNum !== oldPageNum || newPerPageNum !== oldPerPageNum) {
        if (newPerPageNum !== oldPerPageNum) {
          perPage.value = newPerPageNum
        }
        onChange(newPageNum, newPerPageNum)
      }
    })
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
    watchRouteQuery
  }
}

