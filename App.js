import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const CENTER = { latitude: 41.0422, longitude: 28.9784 };
const offset = (p, lat, lon) => ({latitude:p.latitude+lat,longitude:p.longitude+lon});
const between = (a,b,t) => ({latitude:a.latitude+(b.latitude-a.latitude)*t,longitude:a.longitude+(b.longitude-a.longitude)*t});
const timeText = n => Math.floor(n/60)+':'+String(n%60).padStart(2,'0');

export default function App(){
 const map=useRef(null);
 const [pickup,setPickup]=useState(CENTER);
 const [gps,setGps]=useState('Konum aranıyor...');
 const [minutes,setMinutes]=useState(5);
 const [trip,setTrip]=useState(null);
 const [now,setNow]=useState(Date.now());
 useEffect(()=>{
   let live=true;
   (async()=>{
     try{
       const p=await Location.requestForegroundPermissionsAsync();
       if(p.status!=='granted'){setGps('Örnek konum · İstanbul');return;}
       const pos=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});
       if(!live)return;
       const c={latitude:pos.coords.latitude,longitude:pos.coords.longitude};
       setPickup(c);setGps('GPS konumun aktif');
       map.current?.animateToRegion({...c,latitudeDelta:0.02,longitudeDelta:0.02},800);
     }catch(e){if(live)setGps('Örnek konum · İstanbul');}
   })();
   return ()=>{live=false};
 },[]);
 useEffect(()=>{
   if(!trip)return;
   const id=setInterval(()=>setNow(Date.now()),100);
   return ()=>clearInterval(id);
 },[trip]);
 const nearby=[offset(pickup,.004,-.006),offset(pickup,-.005,.003),offset(pickup,.003,.005)];
 const fraction=trip?Math.min(1,Math.max(0,(now-trip.started)/trip.duration)):0;
 const position=trip?between(trip.origin,pickup,fraction):null;
 const remaining=trip?Math.max(0,Math.ceil((trip.duration-(now-trip.started))/1000)):0;
 const start=()=>{
   const started=Date.now();
   setNow(started);
   setTrip({origin:nearby[0],started,duration:minutes*60000});
   map.current?.fitToCoordinates([nearby[0],pickup],{edgePadding:{top:90,bottom:100,left:65,right:65},animated:true});
 };
 return <View style={s.root}>
   <StatusBar barStyle="dark-content"/>
   <View style={s.header}><Text style={s.brand}>🚕 FakeTaksi</Text><Text style={s.tag}>SİMÜLASYON</Text></View>
   <View style={s.mapBox}>
     <MapView ref={map} style={StyleSheet.absoluteFillObject}
       initialRegion={{...CENTER,latitudeDelta:.02,longitudeDelta:.02}}
       showsUserLocation={gps==='GPS konumun aktif'}>
       <Marker coordinate={pickup} title="Sanal alınma noktası"><Text style={s.pin}>📍</Text></Marker>
       {trip?<React.Fragment>
         <Polyline coordinates={[position,pickup]} strokeColor="#151515" strokeWidth={4} lineDashPattern={[9,7]}/>
         <Marker coordinate={position} tracksViewChanges><Text style={s.taxi}>🚕</Text></Marker>
       </React.Fragment>:nearby.map((p,i)=><Marker key={i} coordinate={p}><Text style={s.taxi}>🚕</Text></Marker>)}
     </MapView>
     <View style={s.location}><Text style={s.locationTitle}>📍 {gps}</Text><Text style={s.muted}>Haritadaki taksiler sanaldır.</Text></View>
   </View>
   <View style={s.panel}>
     {trip?<React.Fragment>
       <Text style={s.title}>{remaining===0?'Sanal taksin geldi!':'Sanal taksin yaklaşıyor'}</Text>
       <Text style={s.clock}>{timeText(remaining)}</Text>
       <Text style={s.driver}>Sanal sürücü: Mert Yılmaz</Text>
       <Text style={s.muted}>Sarı taksi · DEMO-34 (kurgusal)</Text>
       <Pressable style={s.cancel} onPress={()=>setTrip(null)}><Text style={s.white}>SİMÜLASYONU BİTİR</Text></Pressable>
     </React.Fragment>:<React.Fragment>
       <Text style={s.title}>Sanal taksi çağır</Text>
       <Text style={s.muted}>Tahmini varış süresini seç</Text>
       <View style={s.options}>{[5,10].map(n=><Pressable key={n} onPress={()=>setMinutes(n)} style={[s.option,minutes===n&&s.selected]}><Text style={s.optionText}>{n} dakika</Text></Pressable>)}</View>
       <Pressable style={s.button} onPress={start}><Text style={s.yellow}>🚕 SANAL TAKSİ ÇAĞIR</Text></Pressable>
     </React.Fragment>}
     <Text style={s.disclaimer}>Eğlence amaçlı simülasyon. Gerçek taksi gönderilmez.</Text>
   </View>
 </View>;
}
const s=StyleSheet.create({
 root:{flex:1,backgroundColor:'#f4f5f6'},
 header:{paddingTop:58,paddingHorizontal:18,paddingBottom:14,backgroundColor:'#ffcf20',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 brand:{fontSize:26,fontWeight:'900',color:'#151515'},
 tag:{backgroundColor:'#151515',color:'white',padding:8,borderRadius:7,fontSize:10,fontWeight:'800'},
 mapBox:{flex:1},location:{position:'absolute',top:14,left:14,right:14,backgroundColor:'white',borderRadius:14,padding:14},
 locationTitle:{fontWeight:'800',color:'#151515'},muted:{color:'#667085',fontSize:12,marginTop:6},
 taxi:{fontSize:30},pin:{fontSize:30},
 panel:{backgroundColor:'white',padding:22,borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:32},
 title:{fontSize:23,fontWeight:'900',color:'#151515'},
 options:{flexDirection:'row',gap:12,marginVertical:20},
 option:{flex:1,padding:16,backgroundColor:'#e9ebee',borderRadius:12,alignItems:'center'},
 selected:{backgroundColor:'#ffcf20'},optionText:{fontWeight:'800'},
 button:{backgroundColor:'#151515',borderRadius:13,padding:18,alignItems:'center'},
 yellow:{color:'#ffcf20',fontWeight:'900'},
 cancel:{backgroundColor:'#b42318',borderRadius:13,padding:17,alignItems:'center',marginTop:16},
 white:{color:'white',fontWeight:'800'},
 clock:{fontSize:48,fontWeight:'900',textAlign:'center',marginVertical:12},
 driver:{fontWeight:'800',color:'#151515'},
 disclaimer:{fontSize:10,color:'#667085',textAlign:'center',marginTop:15}
});