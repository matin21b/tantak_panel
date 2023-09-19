export const state = () => ({
    person: [],
    landing_user: null
})

export const mutations = {
    set_person: function (state, data) {
        if (data) {
            state.person = [data, ...state.person]
        }
    },
    set_landing_user: function (state, data) {
        state.landing_user = data
    },
}

export const actions = {
    async setPerson({ commit }, person) {
        await commit('set_person', person)
    },
    async setLandingUser({ commit }, user) {
        await commit('set_landing_user', user)
    },
    async searchPerson({ dispatch }, body) {
        let person = await dispatch('searchLocalPerson', body)
        if (person == null) {
            person = await dispatch('searchServerPerson', body)
        }
        return person
    },
    searchServerPerson({ commit }, body) {
        return new Promise((res, rej) => {
            this.$reqApi('/payamgostar/person/find', body)
                .then((response) => {
                    let person = null
                    if (Array.isArray(response)) {
                        person = response[0]
                    } else {
                        person = response
                    }
                    commit('set_person', person)
                    res(person)
                })
                .catch((error) => {
                    res(null)
                })
        })
    },
    searchLocalPerson({ state }, body) {
        if (Boolean(body.NationalCode)) {
            let check = state.person.find(x => x.NationalCode == body.NationalCode)
            if (Boolean(check)) {
                return check
            }
        }
        if (Boolean(body.CrmId)) {
            let check = state.person.find(x => x.CrmId == body.CrmId)
            if (Boolean(check)) {
                return check
            }
        }
        return null
    },
    searchServerOpportunity({ commit }, body) {
        return new Promise((res, rej) => {
            this.$reqApi('/payamgostar/opportunity/find', body)
                .then((response) => {
                    res(response)
                })
                .catch((error) => {
                    res(null)
                })
        })
    },
}