import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable';
import apolloclient from '../apollo.config'
import { SIGNUP,LOGIN,USER_PROFILE } from '../constants/query'
import {notify} from '@kyvg/vue3-notification'
import router from '../router/index'
provideApolloClient(apolloclient);
export const UserStore = defineStore("user", {
    state: () => ({
        Client:{},
        userLoggedin:localStorage.getItem('ClientToken') ? true : false,
        client_id: ''
    }),
    actions: {
        async signup(fname, lname, phone, password,gender,age){
            console.log(fname, lname, phone, password,gender,age);
            try {
                const response = await apolloclient.mutate({
                    mutation: SIGNUP,
                    variables: {
                        fname: fname,
                        lname: lname,
                        phone: phone,
                        password: password,
                        gender:gender,
                        age:age
                    }

                })
                notify({
                    type: 'success',  
                    text: 'Signup Successful',     
                })
                router.push('/login')     
                return 'Success'
            } catch (err) {
                console.log(err);
                notify({
                    type: 'error',   
                    text: 'Something Were Wrong',    
                })
                return err.message
            }
        },
        async login(phone,password) {
            try {
                console.log(window.localStorage.getItem('ClientToken'));
                window.localStorage.removeItem('ClientToken')
                const response = await apolloclient.mutate({
                    mutation: LOGIN,
                    variables: {
                        phone: phone,
                        password: password
                    }
                })
                localStorage.setItem('ClientToken', response.data.login.accestoken)
                localStorage.setItem('client_id', response.data.login.id)    
                console.log(localStorage.getItem('client_id'));
                console.log("njhnjhhhhhhhhhhhhhhhhhhhhhhhjh",response.data);
                if(window.localStorage.getItem('ClientToken')){
                    await this.user_profile(response.data.login.id)
                    router.push('/')
                }
                location.replace('/')
                notify({
                    type: 'success',  
                    text: 'Login Successful',     
                })
                return response.data
            } catch (err) {
                console.log(err);
                notify({
                    type: 'error',
                    text: 'Something Were Wrong'
                })
                return err.message
            }
        },
        async user_profile(id){
            try{
                const response = await apolloclient.query({
                    query: USER_PROFILE,
                    variables: {
                        id:id
                    }
                })
                console.log(response.data);
                this.Client = response.data.customers[0]
                console.log(this.Client,"user");
                return response.data.customers[0]
            }catch(err){
                console.log(err);
                return err.message
            }
        }
        

    },
    getters: {

    },
    persist: {
        enabled: true,
        mode: "localSession"
    }

})
