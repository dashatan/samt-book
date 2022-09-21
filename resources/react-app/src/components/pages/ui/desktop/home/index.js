import {deepPurple, green, orange, purple} from "@material-ui/core/colors";
import lightBlue from "@material-ui/core/colors/lightBlue";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import Store from "../../../../redux/store";
import {TextField, Button, Typography, Box} from "@material-ui/core";
import translate from "../../../../translate";
import axios from "axios";
import {connect} from "react-redux";
import {Search} from "@material-ui/icons";
import WaveDivider from "../side-components/wave-divider";

const mapStateToProps = (state) => {
   return {
      baseUrl: state.baseUrl,
      blocks: state.homeBlocks,
      slides: state.appSlides,
      filterItems: state.filterItems,
   };
};

function Home(props) {
   const {push} = useHistory();
   const [slides, setSlides] = useState(props.slide || [])
   const servicesSections = [
      {
         name: 'producers',
         title: 'صنایع',
         excerpt: 'واحد های صنعتی ، شهرک های صنعتی و شرکت های مستقر در شهرک های صنعتی همگی جزئی از صنعت این مرز و بوم هستند که بخش مهمی از اقتصاد کشور در دست توانمند آنهاست',
         description: 'شهرک‌های صنعتی مناطقی هستند که علاوه بر تامین امکانات زیربنایی به شکل مناسب، کامل، توجیه‌پذیر و اقتصادی؛ این زمینه را فراهم می‌سازد تا ضمن حفظ مسائل زیست‌ محیطی با تجمیع واحدهای صنعتی در کنار یکدیگر، زمینه ایجاد همکاری‌های جدید را میسر و هم افزایی واحدهای صنعتی را بیشتر کرد. ضمن آنکه در سال‌‌های اخیر ارائه خدمات فنی و تجاری جدید نظیر ایجاد خوشه‌های صنعتی، آموزش‌ واحدهای صنعتی، تورهای صنعتی و نمایشگاهی، حمایت از حضور در بازارهای صادراتی و... نیز در سطح شهرک‌های صنعتی جزو دستور کار و وظایف این سازمان قرار گرفته است.',
         direction: 'rtl',
         icon: props.baseUrl + '/icons/others/industry.png',
         backgroundColor: lightBlue.A100,
         buttons: [
            {
               label: 'شهرک های صنعتی',
               onClick: () => {
                  changeFilterItems([
                     {
                        name:'class',
                        value:'idp',
                     },
                  ])
                  push('/explore')
               },
            },
            {
               label: 'واحد های مستقر در شهرک صنعتی',
               onClick: () => {
                  changeFilterItems([
                     {
                        name:'class',
                        value:'prd',
                     },
                     {
                        name:'insideOfIdp',
                        value:true,
                     }
                  ])
                  push('/explore')
               },
            }
         ],
      },
      {
         name: 'workshops',
         title: 'کارگاه ها',
         excerpt: 'کارگاه ها بخش اعظمی از صنایع کوچک کشور ما هستند که بسیاری از محصولات مورد مصرف مردم را تهیه میکنند',
         description: 'کارگاه بخشی فنی از امور تولیدی یک کارخانه است که در آن ساخت کالا ، یا فرایند خاصی ازتولید صورت می گیرد . مثل کارگاه قالب سازی یا کارگاه رنگرزی . کارگاه ، در لغت به معنی محل انجام کار اتاق یا ساختمانی است که هم فضا و هم ابزار(یا ماشین آلات )مورد نیازبرای ساخت یا تعمیرکالاهای ساخته‌شده را ارائه می‌کند. برای نمونه می‌توان به موسسات صنعتی، کشاورزی، معدنی، ساختمانی، ترابری، مسافربری، خدماتی،تجاری، تولیدی، اماکن عمومی و امثال آن‌ها اشاره کرد.',
         direction: 'ltr',
         icon: props.baseUrl + '/icons/others/workshop2.png',
         backgroundColor: green.A100,
         buttons: [
            {
               label: 'کارگاه های مستقر در شهرک صنعتی',
               onClick: () => {
                  push({
                     pathname: '/explore?class=prd&type=factory&isInIdp=true',
                     state: {
                        class: 'prd',
                        type: 'factory',
                        isInIdp: true,
                     }
                  })
               },
            },
            {
               label: 'کارگاه های خارج از شهرک صنعتی',
               onClick: () => {
                  push({
                     pathname: '/explore?class=prd&type=factory&isInIdp=false',
                     state: {
                        class: 'prd',
                        type: 'factory',
                        isInIdp: false,
                     }
                  })
               },
            }
         ],
      },
      {
         name: 'exhibitions',
         title: 'نمایشگاه ها',
         excerpt: 'نمایشگاه ها نقش بسیار مهمی در معرفی محصولات تولیدی کارخانه جات و کارگاه ها ، هم به توزیع کنندگان و هم به مصرف کنندگان که همان مردم هستند ، ایفا میکند',
         description: 'نمایشگاه مجازی یک نمایشگاه دائمی است که به صورت اینترنتی فعالیت می‌کند. در واقع یک اپلیکیشن نمایشگاهی است که امکان نمایش محصولات و خدمات تولیدی، صادراتی و فروش را برای شرکت ها فراهم می نماید. طریقه ی استفاده از نمایشگاه مجازی : شرکت ها با عضویت و سفارش غرفه می توانند با نام کاربری و رمز عبوری که به آنها ارائه می گردد، تمامی اطلاعات لازم در رابطه با شرکت خود مانند اطلاعات تماس ، بیوگرافی شرکت، محصولات ، گواهینامه ها، اخبار ، تصاویر و ... را در غرفه ی اختصاصی خود درج نمایند.',
         direction: 'rtl',
         icon: props.baseUrl + '/icons/others/exhibition.png',
         backgroundColor: orange.A100,
         buttons: [],
      },
   ];

   useEffect(() => {
      Store.dispatch({
         type: "navTabValue",
         payload: 0,
      });
      slides.length === 0 && getAppSlides();
   }, [])

   function getAppSlides() {
      const url = `${Store.getState().baseUrl}/api/appSlides`;
      axios.post(url).then((e) => {
         setSlides(e.data);
         Store.dispatch({
            type: "appSlides",
            payload: e.data,
         });
      }).catch((e) => {
         console.log(e);
         console.log(e.response);
      });
   }

   function changeFilterItems(newData) {
      let filterItems = props.filterItems;
      newData.map(data => {
         let item = filterItems.find(x => x.name === data.name);
         let itemIndex = filterItems.findIndex(x => x.name === data.name);
         if (item) {
            item.value = data.value;
            if (data.label) {
               item.label = data.label;
            }
            filterItems[itemIndex] = item;
         }
      })
      Store.dispatch({
         type:'filterItems',
         payload:filterItems,
      })
      Store.dispatch({
         type: "getBlocks",
         payload: true,
      });
   }

   return (
      <div
         style={{
            height: "calc(100vh - 60px)",
            marginTop: 60,
            backgroundColor: "#f0f8ff",
            overflowY: 'auto'
         }}
      >
         <div style={{
            width: '100%',
            height: 'calc(100vh - 60px)',
            backgroundImage: `url("${props.baseUrl}/images/backgrounds/factory.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            position: 'relative',
         }}>
            <div style={{
               backgroundColor: "rgba(255,255,255,0.9)",
               padding: 60,
               borderRadius: 10,
               display: 'flex',
               flexFlow: 'column',
               justifyContent: 'center',
               alignItems: 'center',
               width: '60%',
               marginTop: 30,
            }}>
               <img
                  src={props.baseUrl + '/icons/pwa/logo.png'}
                  alt='samtbook'
                  style={{
                     width: 150,
                  }}
               />
               <div style={{height: 50}}/>
               <Typography variant='h4'>
                  {translate('صمت بوک - شبکه اجتماعی کسب وکار')}
               </Typography>
               <div style={{height: 50}}/>
               <div style={{
                  display: 'flex',
                  width: '100%',
               }}>
                  <Button
                     variant='contained'
                     color='primary'
                     style={{
                        marginLeft: 10,
                        width: 100
                     }}>
                     <Search/>
                  </Button>
                  <TextField
                     size='medium'
                     variant='outlined'
                     label={translate('دنبال چه چیزی میگردید ؟')}
                     fullWidth
                  />
               </div>
            </div>
            <div
               style={{
                  width: '100%',
                  position: 'absolute',
                  bottom: -5,
               }}
            >
               {/*<WaveDivider color={lightBlue.A100}/>*/}
            </div>
         </div>
         <div>
            {servicesSections.map((section, key) => {
               return (
                  <Box
                     key={key}
                     style={{
                        minHeight: 300,
                        padding: 100,
                        backgroundColor: section.backgroundColor,
                     }}
                  >
                     <Grid container spacing={4}>
                        {section.direction === 'ltr' && (
                           <Grid item xs={6}>
                              <Box style={{
                                 display: 'flex',
                                 flexFlow: 'column',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                              }}>
                                 <img
                                    src={section.icon}
                                    alt={section.title}
                                    style={{
                                       width: '100%',
                                    }}
                                 />
                              </Box>
                           </Grid>
                        )}
                        <Grid item xs={6}>
                           <Box style={{
                              display: 'flex',
                              flexFlow: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                           }}>
                              <Typography variant='h4'>{translate(section.title)}</Typography>
                              <div style={{height: 20}}/>
                              <Typography variant='h6'
                                          style={{textAlign: "center"}}>{translate(section.excerpt)}</Typography>
                              <Divider style={{
                                 width: '90%',
                                 margin: '15px 0',
                                 borderBottom: '1px solid grey'
                              }}/>
                              <Typography variant='body1'
                                          style={{textAlign: "center"}}>{translate(section.description)}</Typography>
                              <div style={{height: 20}}/>
                              {section.buttons.map((button, key) => {
                                 return (
                                    <Button
                                       variant='contained'
                                       color='primary'
                                       onClick={button.onClick}
                                       style={{
                                          marginBottom: 20,
                                       }}
                                       fullWidth
                                    >
                                       {button.label}
                                    </Button>
                                 )
                              })}
                           </Box>
                        </Grid>
                        {section.direction === 'rtl' && (
                           <Grid item xs={6}>
                              <Box style={{
                                 display: 'flex',
                                 flexFlow: 'column',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                              }}>
                                 <img
                                    src={section.icon}
                                    alt={section.title}
                                    style={{
                                       width: '100%',
                                    }}
                                 />
                              </Box>
                           </Grid>
                        )}
                     </Grid>
                  </Box>
               )
            })}
         </div>
      </div>
   );
}

export default connect(mapStateToProps)(Home);
