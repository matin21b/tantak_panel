export const state = () => ({
  tabel_key: '',
  filters: {},
  pageInfo: {
    orderBy: true,
    page: 1,
    paginate: true,
    paginate_num: 50,
    sortBy: 'created_at',
  },

  store_state: {},
  between: {
    between: {},
    first_b: {},
    second_b: {},
  },
})

export const mutations = {
  set_table_key: (state, data) => {
    state.tabel_key = data
  },
  set_page_info: (state, data) => {
    state.pageInfo = data
  },
  set_filters: (state, data) => {
    state.filters = data
  },
  set_store_state: (state, data) => {
    state.store_state = data
  },
  set_page: (state, data) => {
    state.pageInfo.page = data
  },
  set_between: (state, data) => {
    state.between = data
  },
  set_paginate_num: (state, data) => {
    state.pageInfo.paginate_num = data
  },
}

export const actions = {
  async getTableKey({ commit, state }, data) {
    await commit('set_table_key', data)
  },
  async getPageInfo({ commit, state }, data) {
    await commit('set_page_info', data)
  },
  async getFilters({ commit, state }, data) {
    await commit('set_filters', data)
  },
  async get_store_state({ commit, state }, data) {
    await commit('set_store_state', data)
  },
  async setPage({ commit, state }, page) {
    await commit('set_page', page)
  },
  async getBetween({ commit, state }, data) {
    await commit('set_between', data)
  },
  async setPaginateNum({ commit, state }, data) {
    await commit('set_paginate_num', data)
  },
}
