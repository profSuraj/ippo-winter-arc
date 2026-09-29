import React, {useEffect,useMemo,useState} from 'react';
import {Alert,Image,Linking,Pressable,SafeAreaView,ScrollView,StyleSheet,Switch,Text,TextInput,View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false})});

const RED='#e11d48',BG='#070707',CARD='#111',LINE='#292929',MUTED='#909090',GREEN='#42e58a';
const phases=['RESTART','BUILD','HARD PART','FINISH','FINAL'];
const titles=['The Restart','No Motivation','Creator × Fitness','Recovery','First Test','Boxing Day','Week 1 Recap','Upper Body','Legs + Run','Boxing + Conditioning','Recovery','Upper Body Test','Legs + Run','Week 2 Recap','Halfway','Upper Body','Run','Boxing','Recovery','Creator Day','3-Week Checkpoint','Upper Body','Legs + Run','Boxing','Recovery','Upper Body Test','Running Day','Reflection','Final Test','THE FILM'];
const workouts=[
['Push-ups|3 × 10','Diamond push-ups|2 × 8','Pike push-ups|2 × 8','Squats|3 × 15','Plank|3 × 30 sec','Easy walk/run|15 min'],
['Squats|3 × 15','Reverse lunges|3 × 10 / leg','Calf raises|3 × 15','Wall sit|3 × 30 sec','Easy walk/run|20 min'],
['Push-ups|3 × 12','Diamond push-ups|2 × 8','Pike push-ups|2 × 8','Plank|3 × 40 sec','Shadow boxing|3 × 2 min'],
['Walk|30 min','Mobility|10–15 min','Light stretching|10 min'],
['Push-ups|4 × 12','Diamond push-ups|3 × 8','Pike push-ups|3 × 8','Squats|4 × 15','Plank|3 × 45 sec','Walk/run|15 min'],
['Shadow boxing|5 × 2 min','Burpees|3 × 8','Mountain climbers|3 × 30 sec','High knees|3 × 30 sec','Plank|3 × 45 sec'],
['Walk|20–30 min','Mobility|10 min'],
['Push-ups|4 × 12','Diamond push-ups|3 × 8','Pike push-ups|3 × 8','Plank|3 × 45 sec'],
['Squats|4 × 15','Reverse lunges|3 × 12 / leg','Calf raises|4 × 15','Run/walk|20–25 min'],
['Shadow boxing|5 × 3 min','Burpees|3 × 10','Mountain climbers|3 × 30 sec','High knees|3 × 30 sec'],
['Walk|30 min','Mobility|15 min','Stretching|10 min'],
['Push-ups|4 × 15','Diamond push-ups|3 × 10','Pike push-ups|3 × 10','Plank|3 × 60 sec'],
['Squats|4 × 18','Lunges|3 × 12 / leg','Calf raises|4 × 18','Run/walk|25 min'],
['Walk|20–30 min','Mobility|10 min'],
['Push-ups|Baseline test','Squats|Baseline test','Plank|Baseline test','Run|Baseline test'],
['Push-ups|4 × 15','Diamond push-ups|3 × 10','Pike push-ups|3 × 10','Chair dips|3 × 12','Plank|3 × 60 sec'],
['Easy/moderate run|30 min'],
['Shadow boxing|6 × 2–3 min','Burpees|4 × 10','Mountain climbers|4 × 30 sec','High knees|4 × 30 sec'],
['Walk|30 min','Mobility|15 min'],
['Push-ups|3 × 12','Squats|3 × 15','Walk|20 min'],
['Push-ups|Compare Day 1','Plank|Compare Day 1','Run|Compare Day 1'],
['Push-ups|4 × 15','Diamond push-ups|3 × 10','Pike push-ups|3 × 10','Plank|3 × 60 sec'],
['Squats|4 × 20','Lunges|3 × 15 / leg','Calf raises|4 × 20','Run/walk|30 min'],
['Shadow boxing|6 × 3 min','Burpees|4 × 10','Mountain climbers|4 × 30 sec'],
['Walk|30 min','Mobility|15 min','Stretching|10 min'],
['Push-ups|4 × 15','Diamond push-ups|3 × 12','Pike push-ups|3 × 10','Plank|3 × 60 sec'],
['Run|30–40 min'],
['Walk|30 min','Mobility|15 min'],
['Push-ups|Clean max','Plank|Controlled max','Squats|Controlled max','Run|Same distance as baseline'],
['Walk|Recovery','Stretch|10 min']
];
const reels=['I stopped for a month. So I’m starting again.','Motivation didn’t show up. I did.','TEACH → CREATE → TRAIN → EDIT → POST.','Rest is part of the plan.','5 days ago, this felt harder.','Let’s see how much cardio I’ve actually lost.','7 workouts. 7 Reels. 1 week.','The novelty is gone.','Day 9. Legs are not cooperating.','10 days without quitting.','You don’t need to train hard every day.','Can I beat my Day 1 numbers?','This is where consistency gets boring.','14 days. Still showing up.','15 days ago this was just an idea.','Halfway through the Winter Arc.','Nobody sees the boring miles.','I wanted to skip today.','Progress isn’t always visible.','The creator grind doesn’t stop.','Day 01 vs Day 21.','Can I finish what I started?','My legs hate this challenge.','Day 24. Still showing up.','Recovery is part of the plan.','Let’s test Day 1 vs Day 26.','27 days ago, I couldn’t imagine finishing this.','28 days. What actually changed?','Tomorrow is Day 30. Today I’m testing myself.','I didn’t become a different person in 30 days. I became someone who kept showing up.'];
const quotes=['Discipline is doing it after the excitement is gone.','You do not need a perfect day. You need a completed day.','Small wins become identity when repeated.','Never miss twice.','The boring reps are building the interesting life.','Start before you feel ready.'];
const songs=[['Kar Har Maidaan Fateh','Sanju'],['Zinda','Bhaag Milkha Bhaag'],['Apna Time Aayega','Gully Boy'],['Brothers Anthem','Brothers'],['Sultan','Sultan'],['Lakshya','Lakshya'],['Chak De India','Chak De! India']];
const meals=['Breakfast','Lunch','Snack','Dinner'];
const initial={day:0,days:{},water:2500,waterToday:0,meals:{},profile:{name:'',height:'',weight:''},custom:[],alarm:{enabled:false,id:null,hour:18}};

export default function App(){
 const [s,setS]=useState(initial),[tab,setTab]=useState('Today'),[loaded,setLoaded]=useState(false),[custom,setCustom]=useState('');
 useEffect(()=>{AsyncStorage.getItem('ippo-native').then(x=>x&&setS({...initial,...JSON.parse(x)})).finally(()=>setLoaded(true))},[]);
 useEffect(()=>{if(loaded)AsyncStorage.setItem('ippo-native',JSON.stringify(s))},[s,loaded]);
 const d=s.day, day=s.days[d]||{ex:{},work:false,reel:false,note:''};
 const done=Object.values(s.days).filter(x=>x?.work).length, reelsDone=Object.values(s.days).filter(x=>x?.reel).length;
 const pct=Math.round(done/30*100), waterPct=Math.min(100,Math.round(s.waterToday/s.water*100));
 const patch=(p)=>setS(x=>({...x,days:{...x.days,[d]:{...day,...p}}}));
 const toggle=(i)=>patch({ex:{...day.ex,[i]:!day.ex?.[i]}});
 const alarm=async on=>{
  if(!on){if(s.alarm.id)await Notifications.cancelScheduledNotificationAsync(s.alarm.id).catch(()=>{});setS(x=>({...x,alarm:{...x.alarm,enabled:false,id:null}}));return}
  const perm=await Notifications.requestPermissionsAsync(); if(perm.status!=='granted'){Alert.alert('Notifications disabled','Allow notifications in phone settings first.');return}
  if(s.alarm.id)await Notifications.cancelScheduledNotificationAsync(s.alarm.id).catch(()=>{});
  const id=await Notifications.scheduleNotificationAsync({content:{title:'IPPO × Winter Arc',body:'Workout time. Never miss twice. 🔥',sound:'default'},trigger:{hour:s.alarm.hour,minute:0,repeats:true}});
  setS(x=>({...x,alarm:{...x.alarm,enabled:true,id}}));
 };
 if(!loaded)return <View style={st.loading}><Text style={st.h1}>IPPO</Text><Text style={st.muted}>Loading your arc…</Text></View>;
 return <SafeAreaView style={st.safe}><StatusBar style="light"/>
  <ScrollView contentContainerStyle={st.app}>
   <Text style={st.eyebrow}>IPPO × WINTER ARC</Text><Text style={st.h1}>30 DAYS WITH IPPO</Text><Text style={st.sub}>Bodyweight • Running • Creating • Consistency</Text>
   <View style={st.card}><View style={st.between}><Text style={st.bold}>30 DAY PROGRESS</Text><Text style={st.red}>{pct}%</Text></View><View style={st.progress}><View style={[st.bar,{width:pct+'%'}]}/></View><View style={st.row}><Stat n={done} t="DAYS DONE"/><Stat n={reelsDone} t="REELS"/><Stat n={Object.values(s.days).filter(x=>x?.work&&x?.reel).length} t="BOTH DONE"/></View></View>
   {tab==='Today'&&<Today s={s} d={d} day={day} patch={patch} toggle={toggle} setS={setS} quotes={quotes} songs={songs}/>}
   {tab==='Fuel'&&<Fuel s={s} setS={setS} meals={meals} waterPct={waterPct}/>}
   {tab==='Custom'&&<Custom s={s} setS={setS} value={custom} setValue={setCustom} />}
   {tab==='Profile'&&<Profile s={s} setS={setS}/>}
   {tab==='Settings'&&<Settings s={s} setS={setS} alarm={alarm}/>}
  </ScrollView>
  <View style={st.tabs}>{['Today','Fuel','Custom','Profile','Settings'].map(x=><Pressable key={x} onPress={()=>setTab(x)} style={st.tab}><Text style={[st.tabText,tab===x&&st.active]}>{x}</Text></Pressable>)}</View>
 </SafeAreaView>
}

function Today({s,d,day,patch,toggle,setS,quotes,songs}){
 const song=songs[d%songs.length], songQuery=encodeURIComponent(song[0]+' '+song[1]+' official song');
 const ex=workouts[d],phase=d<7?'RESTART':d<14?'BUILD':d<21?'HARD PART':d<29?'FINISH':'FINAL';
 return <><View style={st.dayNav}><Pressable style={st.small} onPress={()=>setS(x=>({...x,day:Math.max(0,x.day-1)}))}><Text style={st.smallText}>‹</Text></Pressable><View style={{flex:1,alignItems:'center'}}><Text style={st.eyebrow}>{phase} • DAY {d+1}/30</Text><Text style={st.dayTitle}>{titles[d]}</Text></View><Pressable style={st.small} onPress={()=>setS(x=>({...x,day:Math.min(29,x.day+1)}))}><Text style={st.smallText}>›</Text></Pressable></View>
 <View style={st.card}>{ex.map((v,i)=>{let [a,b]=v.split('|'),c=!!day.ex?.[i];return <Pressable key={i} onPress={()=>toggle(i)} style={st.exercise}><View style={[st.box,c&&st.boxDone]}><Text style={st.check}>{c?'✓':''}</Text></View><Text style={[st.exName,c&&st.strike]}>{a}</Text><Text style={st.sets}>{b}</Text></Pressable>})}
 <View style={st.row}><Toggle label="Workout done" value={!!day.work} onChange={v=>patch({work:v})}/><Toggle label="Reel posted" value={!!day.reel} onChange={v=>patch({reel:v})}/></View>
 <View style={st.prompt}><Text style={st.promptLabel}>REEL IDEA + HOOK</Text><Text style={st.promptText}>{reels[d]}</Text></View>
 <Text style={st.label}>DAY NOTES</Text><TextInput value={day.note||''} onChangeText={v=>patch({note:v})} multiline placeholder="How did today go?" placeholderTextColor="#666" style={st.textarea}/></View>
 <View style={st.card}><Text style={st.eyebrow}>TODAY'S MINDSET</Text><Text style={st.quote}>“{quotes[d%quotes.length]}”</Text><View style={st.songRow}><Text style={st.muted}>🎵 {song[0]} — {song[1]}</Text><Pressable style={st.playButton} onPress={()=>Linking.openURL('https://www.youtube.com/results?search_query='+songQuery)}><Text style={st.playText}>▶ PLAY</Text></Pressable></View></View></>
}
function Fuel({s,setS,meals,waterPct}){
 const today=new Date().toISOString().slice(0,10),m=s.meals[today]||{};
 const water=n=>setS(x=>({...x,waterToday:Math.max(0,Math.min(x.water,x.waterToday+n))}));
 return <><Title e="FUEL + HYDRATION" t="Keep the engine running"/><View style={st.card}><View style={st.between}><Text style={st.bold}>WATER</Text><Text style={st.red}>{s.waterToday} / {s.water} ml</Text></View><View style={st.progress}><View style={[st.bar,{width:waterPct+'%'}]}/></View><Text style={st.big}>{waterPct}%</Text><View style={st.row}><Button t="+250 ml" on={()=>water(250)}/><Button t="+500 ml" on={()=>water(500)}/><Button t="Reset" on={()=>water(-s.waterToday)} secondary/></View><Text style={st.muted}>Set your own target; increase gradually with activity, heat and sweat.</Text><Text style={st.label}>TARGET (ML)</Text><TextInput value={String(s.water)} onChangeText={v=>setS(x=>({...x,water:Number(v)||2500}))} keyboardType="number-pad" style={st.input}/></View>
 <View style={st.card}><Text style={st.bold}>TODAY'S MEALS</Text>{meals.map(x=><View style={st.meal} key={x}><Text style={st.mealName}>{x}</Text><TextInput value={m[x]||''} onChangeText={v=>setS(s=>({...s,meals:{...s.meals,[today]:{...m,[x]:v}}}))} placeholder="What did you eat?" placeholderTextColor="#666" style={st.mealInput}/></View>)}<Text style={st.muted}>🥚 Protein focus: eggs, dal, paneer, curd, chicken, fish, soy or another option that fits you.</Text><Text style={st.muted}>🍎 Include fruit/vegetables across the day.</Text></View>
 <View style={st.card}><Text style={st.eyebrow}>IPPO FOOD GUIDE</Text><Text style={st.screenTitle}>Eat for your goal</Text><Text style={st.muted}>Same food. Different quantity. Different results. Choose your goal and stay consistent.</Text>
 <FoodPlan title="FAT LOSS" kcal="~1800 KCAL/DAY" items={[
  ['1. Breakfast','Poha (1 bowl) • Sprouts Salad • Green Tea','320'],
  ['2. Mid-morning','1 Apple • 5–6 Almonds','120'],
  ['3. Lunch','2 Roti (Multigrain) • Dal (1 bowl) • Mixed Veg Sabzi • Cucumber Salad','550'],
  ['4. Evening Snack','Roasted Chana (1 bowl) • Green Tea','120'],
  ['5. Dinner','2 Roti (Multigrain) • Paneer Bhurji (100g) • Fruit Salad','500'],
  ['6. Before Bed','Low Fat Milk (1 glass)','120']
 ]}/>
 <FoodPlan title="WEIGHT GAIN" kcal="~2600 KCAL/DAY" items={[
  ['1. Breakfast','Oats (1 bowl) with Milk • 2 Banana • 5–6 Walnuts • Peanut Butter (1 tbsp)','600'],
  ['2. Mid-morning','Banana Shake • 5–6 Almonds','350'],
  ['3. Lunch','3 Roti • Brown Rice (1 cup) • Dal (1 bowl) • Paneer Curry (100g)','900'],
  ['4. Evening Snack','Peanut Butter Sandwich (2 slices) • Milk (1 glass) • 1 Banana','450'],
  ['5. Dinner','3 Roti • Paneer Sabzi (150g) • Dal (1 bowl) • Curd (1 bowl) • Salad','750'],
  ['6. Before Bed','Milk (1 glass) • 5–6 Almonds • 1 Date','200']
 ]}/>
 <Text style={st.muted}>Example plans only. Calorie needs vary by person, activity and goal.</Text></View></>
}
function FoodPlan({title,kcal,items}){return <View style={st.foodPlan}><View style={st.between}><Text style={st.bold}>{title}</Text><Text style={st.red}>{kcal}</Text></View>{items.map(([meal,food,cal])=><View style={st.foodItem} key={meal}><View style={st.foodIcon}><Text style={st.foodIconText}>🍽</Text></View><View style={st.foodCopy}><View style={st.between}><Text style={st.foodMeal}>{meal}</Text><Text style={st.foodCal}>{cal} kcal</Text></View><Text style={st.foodText}>{food}</Text></View></View>)}</View>}
function Custom({s,setS,value,setValue}){
 const add=()=>{if(!value.trim())return;setS(x=>({...x,custom:[...x.custom,{name:value.trim(),sets:'3 × 10'}]}));setValue('')};
 return <><Title e="CUSTOM WORKOUT" t="Build your own session"/><View style={st.card}><Text style={st.bold}>ADD EXERCISE</Text><View style={st.inputRow}><TextInput value={value} onChangeText={setValue} placeholder="e.g. Pull-ups" placeholderTextColor="#666" style={st.input}/><Button t="+" onPress={add}/></View>{s.custom.map((x,i)=><View style={st.customRow} key={i}><Text style={st.exName}>{x.name}</Text><TextInput value={x.sets} onChangeText={v=>setS(s=>({...s,custom:s.custom.map((z,j)=>j===i?{...z,sets:v}:z)}))} style={st.setInput}/><Pressable onPress={()=>setS(s=>({...s,custom:s.custom.filter((_,j)=>j!==i)}))}><Text style={st.delete}>×</Text></Pressable></View>)}</View><View style={st.card}><Text style={st.bold}>20-MINUTE AMRAP BENCHMARK</Text><Text style={st.muted}>5 pull-ups → 10 push-ups → 15 air squats → repeat for 20 minutes. Use as an occasional benchmark, not a daily workout.</Text></View></>
}
function Profile({s,setS}){return <><Title e="YOUR PROFILE" t="Know your baseline"/><View style={st.card}>{[['name','Name'],['height','Height (cm)'],['weight','Current weight (kg)']].map(([k,l])=><View key={k}><Text style={st.label}>{l}</Text><TextInput value={String(s.profile[k]||'')} onChangeText={v=>setS(x=>({...x,profile:{...x.profile,[k]:v}}))} keyboardType={k==='name'?'default':'decimal-pad'} placeholder={l} placeholderTextColor="#666" style={st.input}/></View>)}<Text style={st.muted}>Profile data stays on this device. No account required.</Text></View></>}
function Settings({s,setS,alarm}){return <><Title e="APP SETTINGS" t="Make consistency easier"/><View style={st.card}><View style={st.between}><View><Text style={st.bold}>DAILY WORKOUT ALARM</Text><Text style={st.muted}>Native phone notification</Text></View><Switch value={s.alarm.enabled} onValueChange={alarm} trackColor={{false:'#333',true:RED}}/></View><View style={st.alarm}><Pressable style={st.small} onPress={()=>setS(x=>({...x,alarm:{...x.alarm,hour:(x.alarm.hour+23)%24}}))}><Text style={st.smallText}>−</Text></Pressable><Text style={st.alarmTime}>{String(s.alarm.hour).padStart(2,'0')}:00</Text><Pressable style={st.small} onPress={()=>setS(x=>({...x,alarm:{...x.alarm,hour:(x.alarm.hour+1)%24}}))}><Text style={st.smallText}>+</Text></Pressable></View></View><View style={st.card}><Text style={st.bold}>DATA</Text><Button t="Reset all progress" secondary onPress={()=>Alert.alert('Reset progress?','This clears IPPO data on this device.',[{text:'Cancel'},{text:'Reset',style:'destructive',onPress:async()=>{await AsyncStorage.removeItem('ippo-native');setS(initial)}}])}/></View></>}
function Title({e,t}){return <View style={{paddingVertical:10}}><Text style={st.eyebrow}>{e}</Text><Text style={st.screenTitle}>{t}</Text></View>}
function Stat({n,t}){return <View style={st.stat}><Text style={st.statN}>{n}</Text><Text style={st.statT}>{t}</Text></View>}
function Toggle({label,value,onChange}){return <Pressable onPress={()=>onChange(!value)} style={[st.toggle,value&&st.toggleDone]}><View style={[st.box,value&&st.boxDone]}><Text style={st.check}>{value?'✓':''}</Text></View><Text style={st.toggleText}>{label}</Text></Pressable>}
function Button({t,on,secondary,onPress}){return <Pressable onPress={onPress||on} style={[st.button,secondary&&st.secondary]}><Text style={st.buttonText}>{t}</Text></Pressable>}

const st=StyleSheet.create({
 safe:{flex:1,backgroundColor:BG},app:{padding:14,paddingBottom:100},loading:{flex:1,backgroundColor:BG,alignItems:'center',justifyContent:'center'},eyebrow:{fontSize:10,color:RED,fontWeight:'900',letterSpacing:1.7},h1:{fontSize:38,lineHeight:40,color:'#fff',fontWeight:'900',letterSpacing:-2,marginVertical:8},sub:{fontSize:13,color:MUTED},card:{backgroundColor:CARD,borderWidth:1,borderColor:LINE,borderRadius:18,padding:16,marginVertical:7},between:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},bold:{fontSize:13,fontWeight:'900',color:'#fff'},red:{color:RED,fontWeight:'900'},progress:{height:10,backgroundColor:'#242424',borderRadius:20,overflow:'hidden',marginVertical:12},bar:{height:'100%',backgroundColor:RED,borderRadius:20},row:{flexDirection:'row',gap:8},stat:{flex:1,backgroundColor:'#0c0c0c',borderWidth:1,borderColor:'#202020',borderRadius:12,padding:11},statN:{fontSize:22,fontWeight:'900',color:'#fff'},statT:{fontSize:9,color:MUTED,marginTop:3,fontWeight:'800'},dayNav:{flexDirection:'row',alignItems:'center',paddingVertical:10},small:{width:40,height:40,borderRadius:12,borderWidth:1,borderColor:LINE,backgroundColor:'#101010',alignItems:'center',justifyContent:'center'},smallText:{fontSize:22,color:'#fff',fontWeight:'900'},dayTitle:{fontSize:21,color:'#fff',fontWeight:'900',marginTop:3},exercise:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#242424'},box:{width:22,height:22,borderRadius:7,borderWidth:1.5,borderColor:'#555',alignItems:'center',justifyContent:'center'},boxDone:{backgroundColor:RED,borderColor:RED},check:{color:'#fff',fontWeight:'900'},exName:{flex:1,color:'#fff',fontWeight:'800',fontSize:13},strike:{textDecorationLine:'line-through',opacity:.5},sets:{color:MUTED,fontSize:11},toggle:{flex:1,flexDirection:'row',alignItems:'center',gap:7,borderWidth:1,borderColor:LINE,borderRadius:12,padding:11,backgroundColor:'#0d0d0d'},toggleDone:{borderColor:'#2b6c49',backgroundColor:'#0c2117'},toggleText:{flex:1,color:'#fff',fontWeight:'800',fontSize:11},prompt:{backgroundColor:'#0b0b0b',borderLeftWidth:3,borderLeftColor:RED,padding:13,borderRadius:10,marginTop:14},promptLabel:{fontSize:9,color:RED,fontWeight:'900',letterSpacing:1.4},promptText:{color:'#eee',fontSize:13,lineHeight:19,marginTop:5},label:{fontSize:10,color:'#aaa',fontWeight:'900',letterSpacing:1,marginTop:14,marginBottom:7},textarea:{minHeight:90,borderWidth:1,borderColor:LINE,borderRadius:11,color:'#fff',backgroundColor:'#0b0b0b',padding:11,textAlignVertical:'top'},quote:{fontSize:20,lineHeight:28,color:'#fff',fontWeight:'800',marginTop:8},songRow:{flexDirection:'row',alignItems:'center',gap:10},playButton:{backgroundColor:RED,borderRadius:9,paddingHorizontal:12,paddingVertical:8,marginTop:10},playText:{color:'#fff',fontSize:10,fontWeight:'900'},muted:{fontSize:12,color:'#aaa',lineHeight:19,marginTop:10},big:{fontSize:38,fontWeight:'900',color:'#fff',marginBottom:10},button:{flex:1,backgroundColor:RED,borderRadius:11,paddingVertical:13,alignItems:'center',justifyContent:'center',marginTop:8},secondary:{backgroundColor:'#252525'},buttonText:{color:'#fff',fontWeight:'900',fontSize:12},screenTitle:{fontSize:28,color:'#fff',fontWeight:'900',letterSpacing:-1,marginTop:5},foodPlan:{backgroundColor:'#0b0b0b',borderWidth:1,borderColor:LINE,borderRadius:14,padding:11,marginTop:12},foodItem:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:9,borderBottomWidth:1,borderBottomColor:'#222'},foodIcon:{width:48,height:48,borderRadius:11,backgroundColor:'#1a1a1a',alignItems:'center',justifyContent:'center'},foodIconText:{fontSize:22},foodCal:{fontSize:10,color:'#fff',fontWeight:'900'},foodCopy:{flex:1},foodMeal:{fontSize:9,color:RED,fontWeight:'900',letterSpacing:1},foodText:{fontSize:12,color:'#fff',fontWeight:'700',lineHeight:17,marginTop:3},input:{flex:1,color:'#fff',backgroundColor:'#0b0b0b',borderWidth:1,borderColor:LINE,borderRadius:11,padding:11,marginBottom:8},inputRow:{flexDirection:'row',gap:8,marginTop:8},meal:{flexDirection:'row',alignItems:'center',gap:8,paddingVertical:7,borderBottomWidth:1,borderBottomColor:'#242424'},mealName:{width:70,color:'#fff',fontWeight:'800',fontSize:12},mealInput:{flex:1,color:'#fff',backgroundColor:'#0b0b0b',borderWidth:1,borderColor:LINE,borderRadius:9,padding:9,fontSize:12},customRow:{flexDirection:'row',alignItems:'center',gap:8,paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#242424'},setInput:{width:85,color:'#fff',backgroundColor:'#0b0b0b',borderWidth:1,borderColor:LINE,borderRadius:9,padding:8,fontSize:11},delete:{color:'#ff657f',fontSize:24},alarm:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:20,paddingVertical:18},alarmTime:{fontSize:30,color:'#fff',fontWeight:'900',minWidth:90,textAlign:'center'},tabs:{position:'absolute',left:8,right:8,bottom:8,height:60,backgroundColor:'#111',borderWidth:1,borderColor:LINE,borderRadius:18,flexDirection:'row'},tab:{flex:1,alignItems:'center',justifyContent:'center'},tabText:{fontSize:10,color:'#777',fontWeight:'900'},active:{color:'#fff'}
});