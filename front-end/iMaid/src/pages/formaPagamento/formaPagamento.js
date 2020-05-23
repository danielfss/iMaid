import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import style from './styles'


export default class formaPagamento extends Component{
    constructor(props){
        super(props)
        this.state = {
        cartoes: [],
        opcaoPagamento: 6,
        tela: 'formaPagamento',
        receive: false,
        }
        this.pegarDadosBD = this.pegarDadosBD.bind(this)
        this.selecionarRadio = this.selecionarRadio.bind(this) 
        this.setReceive = this.setReceive.bind(this)
      }
    
  pegarDadosBD () {
    fetch('http://192.168.0.104:3001/cartoes/')
    .then(response=> response.json())
    .then(cartoes=> {this.setState({ cartoes: cartoes })})
    console.warn('Carregando dados de cartões...')
    this.setState({receive: true})
  }  
  
  selecionarRadio(indice){
    this.setState({opcaoPagamento: indice})
  }
  
  setReceive(opcao){
    this.setState({receive: opcao})
  }
  
  render(){
    var state = this.state

    let cartoes = this.state.cartoes.map((valor, i)=>(
      <RenderizarItens numeroCartao={valor.numero} bandeira={valor.bandeira} indice={i+1} tipo={'Cartão'}/>
    ))
  
    var selecionarRadio =  this.selecionarRadio 
    var pegarDadosBD = this.pegarDadosBD
    var setReceive = this.setReceive
    function RenderizarItens(props){
      
      
      return(
        <View style={style.item}> 
          <View style={style.areaInfoCartao}>
            <View style={style.icone}>
              <Image
                style={style.img}
                source = {{
                  uri: 
                  props.tipo === 'Dinheiro'? require('./../../icones/dinheiro.png') : 
                  props.bandeira === 'MasterCard'? require('./../../icones/mastercard.png') :
                  props.bandeira === 'Visa'? require('./../../icones/visa.png') :  
                  props.bandeira === 'Outro'? require('./../../icones/credit-card.png') : ''
                }}
              />
            </View>
            <View style={style.infoCartoes}>
              <Text style={ style.textoNomeMetodoPagamento }>{props.tipo} {props.indice !== 6 ? props.indice : ''}</Text>
              <Text style={ style.texto }>{props.bandeira}</Text>
            </View>
            <View style={style.radio}>
              <TouchableOpacity 
              style={ style.radioCirculo }
              onPress={()=> selecionarRadio(props.indice) }
              > 
                {state.opcaoPagamento === props.indice && <View style={ style.radioBola }></View> } 
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.numeroCartao}>
            <Text style={ style.texto }>{props.numeroCartao}</Text> 
          </View>
        </View>
      );
    }

    function AdicionarCartao(){
        const navigation = useNavigation()
        return(
            
            <View style = {style.viewButton}>
              <TouchableOpacity 
              style = {style.button}
              onPress={ ()=> {
                navigation.navigate('Adicionar Cartão')
                setReceive(false) //Faz fazer o fetch dos cartões quando voltar para a pagina
              }}
              >
                <Text style={ style.textoButton }>ADICIONAR CARTÃO</Text>
              </TouchableOpacity>
            
           
            </View>
        )
    }
    if(!state.receive) pegarDadosBD() // se nunca tiver recebidos os dados, faz a requisição
    return (
      <View style={style.container} > 
        {/* <View style = { styles.cabeçalho }>
          <Text style={ styles.texto }>Forma de Pagamento</Text>
        </View> */} 
        <View style={ style.telaFuncional }> 
                     {/* Renderiza todos os cartões */}
        {cartoes} 
                    {/* Renderiza apenas o Item Dinheiro*/}
        <RenderizarItens tipo={'Dinheiro'}  indice={6}/>
                    {/* Renderiza um botão que leva para a pagina adicionarCartao */}
        <AdicionarCartao />
       
        <Text>Implementar deletar cartão</Text>
        <Text>Implementar editar cartão</Text>
        <Text>Colocar limite de cartões = 3</Text>
        <Text>Colocar imagem da bandeira do cartão</Text>
       
        </View>
      </View>
    );
  }
}



