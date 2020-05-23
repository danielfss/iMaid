import React, { Component, useState } from 'react';
import { Text, View, TextInput, Image, StyleSheet, Picker, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { State } from 'react-native-gesture-handler';
import style from './styles'


import axios from 'axios'

axios.get()

// var axios = require('axios')


export default function adicionarCartao({routes}){

    var [numero, setNumero] = useState('...')
    var [vencimento, setVencimento] = useState('MM/AA')
    var [csv, setCsv] = useState('CSV')
    var [dadosPicker, setDadosPicker] = useState([])
    var [pais, setPais] = useState('Brasil')
    var [dono, setDono] = useState('Paulo')
    var [bandeira, setBandeira] = useState('')
    var [receive, setReceive] = useState(false)
    var [modo, setModo] = useState(0)

    function PegarPaises(){
        fetch('http://192.168.0.104:3001/paises/')
        .then((dados)=> dados.json())
        .then((dados)=> {
            setDadosPicker(dados)
            setReceive(true)
            console.log('Leu os paises...')
        })
    }
    
    

    let item = dadosPicker.map((valor, i)=>{
        return <Picker.Item key={i} label={valor.nome} value={valor.nome} />
    })

    function BotaoCadastrar(){
        //adicionarCartao/:numero/:mesVencimento/:anoVencimento/:csv/:nomeDono/:bandeira
        // ex: http://192.168.0.104:3001/cartoes/adicionarCartao/11111111111/24/05/426/Paulo/Master
        return(
            <View style = {style.viewButton}>
              <TouchableOpacity 
              style = {style.button}
              onPress={ () => {
                var url = `http://192.168.0.104:3001/cartoes/adicionarCartao/${numero}/${vencimento}/${csv}/${dono}/${bandeira}`
                axios.post(url)
                console.log('URL POST: ' + url)  
            }}
              >
                <Text style={ style.textoButton }>ADICIONAR CARTÃO</Text>
              </TouchableOpacity>
            
           
            </View>
        )
    }

    // modo é pra dizer se pode ou não apagar, para não ficar apagando e dando espaço infinitamente
    function onChangeNumero(value){
        //Garante que só será cadastrado numeros
        if(!isNaN(parseInt(value.substring(value.length-1)))){
            setNumero(value)
            if(value.length==4 && modo===0 ) { //Faz o espaço sozinho
                setNumero(value + ' ')
            }
            else if(value.length==6) setModo(1) //Seta para 1 após o primeiro caractere após o espaço, garante que dá pra apagar o espaço depois
            else if(value.length<=3 && modo==1) setModo(0) //Garante que após apagar ele consiga escrever mantendo a mascara

            if(value.length==9 && modo==1) { //Faz o espaço sozinho
                setNumero(value + ' ')
            }
            else if(value.length==11) setModo(0) // Garante que dá pra apagar o espaço depois
            else if(value.length==9 && modo==0) setModo(1) //Garante que após apagar ele consiga escrever mantendo a mascara

            if(value.length==14 && modo==0) { //Faz o espaço sozinho
                setNumero(value + ' ')
            }
            else if(value.length==16) setModo(1) // Garante que dá pra apagar o espaço depois
            else if(value.length==14 && modo==1) setModo(0) //Garante que após apagar ele consiga escrever mantendo a mascara

            if(value.length>=18) { //Garante que não passe de 18 caracteres
                setNumero(value.substring(0, 18))
            }
        }
        if(value.substring(value.length-1) === ' ' || value.substring(value.length-1) === '' ){
            setNumero(value) // permite apagar caso o ultimo digito seja ' ' ou quando for o ultimo digito da sting a ser apagada   
        } 
        // Coloca a devida bandeira no cartão
        // O VISA é 4xxxxx O MASTERCARD varia de 51xxxx - 55xxxx
        if (value.substring(0, 1) === '4'){
            setBandeira('Visa')
        }
        else if(value.substring(0, 2) === '51' || numero.substring(0, 2) === '52' || numero.substring(0, 2) === '53' || numero.substring(0, 2) === '54' || numero.substring(0, 2) === '55'){
            setBandeira('MasterCard')
        }
        else setBandeira('Outra')  
    }       
        
    if (!receive) PegarPaises() //Carrega a lista de paises apenas uma vez
    //console.disableYellowBox = true // Desabilita as Warnings
    
    return(
        <View style={style.conteiner} >
            <View style={style.areaInputNumero}> 
                <View style={style.areaTexto}>
                    <Text style={ style.texto }>Número do cartão</Text>
                </View>
                <View style={style.corpoInput}>
                    <View style={style.areaImg}>
                        <Image
                            style={style.img}
                            source= {require('./../../icones/credit-card.png')}
                        />
                    </View>
                    <View style={style.centro}>
                        <TextInput 
                            style={style.input} 
                            value={numero}
                            onFocus={()=> {
                                if(numero=== '...') setNumero('')
                            }}
                            onChangeText={ (value)=> onChangeNumero(value)}
                            onBlur={()=> {
                                if(numero.length==0){[
                                    setNumero('...')
                                ]} 
                            }}
                        ></TextInput>
                    </View>
                    <View style={style.areaImg2}>
                        <Image
                            style={style.img2}
                            source= {require('./../../icones/camera.png')}
                        />
                    </View>
                </View>   
            </View>
            <View style={style.areaInputDublo}> 
                <View style={style.corpoInputEsquerda}>
                    <View style={style.areaInput1}>
                        <TextInput 
                            style={style.input} 
                            value={vencimento}
                            onFocus={()=> {
                                if(vencimento==='MM/AA') setVencimento('')
                                setModo(0)
                            }}
                            onChangeText={ (value)=> {
                                console.log(value)
                                if(!isNaN(parseInt(value.substring(value.length-1)))){
                                    if(value.length<=5){
                                        if(value.length==2){
                                            setVencimento(value + '/')
                                            setModo(1) //Permite que a '/' seja apagada depois
                                        }
                                        else setVencimento(value)
                                    }
                                }
                                if(value.substring(value.length-1) === '/' || value.substring(value.length-1) === '' || (modo == 1 && !isNaN(parseInt(value.substring(value.length-1)))) ){
                                    setVencimento(value) // permite apagar caso o ultimo digito seja / ou quando for o ultimo digito da sting a ser apagada   
                                    setModo(0)
                                }     
                            }}
                            onBlur={()=> {
                                if(vencimento.length==0) setVencimento('MM/AA')
                            }}
                        ></TextInput>
                    </View>
                    <View style={style.areaImg3}>
                        <Image
                            style={style.img3}
                            source= {require('./../../icones/interrogacao.png')}
                        />
                    </View>
                </View>
                <View style={style.corpoInputDireita}>
                    <View style={style.areaInput2}>
                    <TextInput 
                            style={style.input} 
                            value={csv}
                            onFocus={()=> {
                                if(csv === 'CSV') setCsv('')
                            }}
                            onChangeText={ (value)=> {
                                if(!isNaN(parseInt(value.substring(value.length-1))) && value.length<=3){
                                    setCsv(value) 
                                }
                                if(value.substring(value.length-1) === '' ){
                                    setCsv(value) // permite apagar caso seja o ultimo digito da sting a ser apagada   
                                }   
                            }}
                            onBlur={()=> {
                                if(csv.length==0) setCsv('CSV')
                            }}
                        ></TextInput>
                    </View>
                    <View style={style.areaImg3}>
                        <Image
                            style={style.img3}
                            source= {require('./../../icones/interrogacao.png')}
                        />
                    </View>
                </View>   
            </View>
            
            <View style={style.pais}>
                <View style={style.areaImgPais}>
                    <Image
                            style={style.imgPais}
                            source= {require('./../../icones/bandeira.png')}
                        />
                    </View>
                <View style={style.areaPicker}>
                    <Picker
                        selectedValue = {pais}
                        style={style.picker}
                        onValueChange={(value, id)=> setPais(value) }
                    >
                        {item}
                    </Picker>
                </View>
            </View>
            
            <BotaoCadastrar/>

            <Text>Implementar uma mascara de strings no input</Text>
            <Text>Arrumar os inputs pro texto não sumir quando não digitar nada</Text>
            <Text>Exibir modal quando apertar na interrogação</Text>
            <Text>Fazer validação de strings no adicionarCartao</Text>
            
            

        </View>
    )
}

