import React, { Component } from 'react';
import _ from 'lodash';
import {
  FaEnvelope,
  FaPhone,
  FaComments,
  FaPeopleCarry,
  FaInbox,
  FaAward,
  FaCaretDown,
  FaCheck,
  FaRegDotCircle,
  FaRegCircle
} from 'react-icons/fa';
import {
  MdTouchApp,
} from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import {
  Fab,
  Card,
  CardContent,
  CardHeader,
  TextField,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  Radio,
  // Switch,
  RadioGroup,
  FormControlLabel,
  // FormGroup,
  // Grid,
  // ButtonGroup
} from '@material-ui/core';
import {
  Link
} from 'react-router-dom';
import validate from 'react-joi-validation';
import PropTypes from 'prop-types';

import SliderButton from './reusable/withStyles/StyledSliderButton';
import TestimonialsCarousel from './TestimonialsCarousel';
import {
  ENGLISH,
  SPANISH
} from './utils/availableLocales';
import formatLink from './utils/Link';
import SignUpSchema from './schema/SignUpSchema';
import contactInfo from '../ContactInfo';
// import UserMap from './UserMap';
import { gtag_click_conversion, gtag_formsent_conversion, opts } from './reusable/tracking';


const pageContent = {
  testimonials: [
    {
      names: 'Yaquelin',
      es_names: 'Yaquelin',
      role: 'English Client',
      es_role: 'Clienta de Inglés',
      location: 'Venezuela',
      quote1: '',
      quote2: '',
      es_quote1: '',
      es_quote2: '',
      img_src: '',
      video: true,
      video_src: 'https://s3.amazonaws.com/elasticbeanstalk-us-east-1-853357102893/testimonials/yaquelin_testimonial_subs.mp4',
    },
    {
      names: 'Irma and Mirella',
      es_names: 'Irma y Mirella',
      role: 'Citizenship Client and Volunteer',
      es_role: 'Clienta y Voluntaria de Ciudadanía',
      location: 'New York, NY',
      quote1: 'Irma: "I felt very comfortable and grateful for Tutoria\'s help. I give them five stars!"',
      quote2: 'Mirella: "Tutoria is an excellent program because I set my own hours and have an opportunity to practice my Spanish. Also, Tutoria\'s staff is kind and really wants to help people."',
      es_quote1: 'Irma: "Me sentí muy cómoda y agradecida por la ayuda de Tutoria. ¡Les doy cinco estrellas!"',
      es_quote2: 'Mirella: "Tutoría es un programa excelente porque yo establezco mi horario y tengo una oportunidad para practicar mi español. Además, los administradores/as son amables y realmente quieren ayudar a la gente."',
      img_src: 'https://s3.amazonaws.com/elasticbeanstalk-us-east-1-853357102893/testimonials/IrmaandMirella.jpg',
      video: false,
      video_src: '',
    },
    {
      names: 'Amilcar and Dane',
      es_names: 'Amilcar y Dane',
      role: 'Citizenship Client and Volunteer',
      es_role: 'Cliente y Voluntario de Ciudadanía',
      location: 'New York, NY',
      quote1: 'Amilcar: "Tutoria volunteers are very organized and professional. I would definitely recommend them."',
      quote2: 'Dane: "Tutoria is a fantastic organization with a really positive mission. I\'ve really enjoyed working with Amilcar. It\'s exciting seeing the progress he\'s made, and I\'m looking forward to continuing our work together."',
      es_quote1: 'Amilcar: "Los voluntarios/as de Tutoria son muy organizados y profesionales. Yo definitivamente los recomendaría."',
      es_quote2: 'Dane: "Tutoria es una organización fantástica con un objetivo realmente positivo. Realmente disfruté ayudar a Amilcar. Es emocionante ver el progreso que el ha realizado, y espero continuar nuestros estudios juntos."',
      img_src: 'https://s3.amazonaws.com/elasticbeanstalk-us-east-1-853357102893/testimonials/AmilcarandDane.jpeg',
      video: false,
      video_src: '',
    },
    {
      names: 'Glenis',
      es_names: 'Glenis',
      role: 'Citizenship Client',
      es_role: 'Clienta de Ciudadanía',
      location: 'New York, NY',
      quote1: '"Excellent program - good volunteers in English and Spanish. I recommend it to all. Their English and citizenship classes are totally free!"',
      quote2: '',
      es_quote1: '"Excelente programa - buenos voluntarios/as en inglés y español. Lo recomiendo a todos/as. Sus clases de ciudadanía y de inglés son totalmente gratis."',
      es_quote2: '',
      img_src: 'https://s3.amazonaws.com/elasticbeanstalk-us-east-1-853357102893/testimonials/glenis.jpg',
      video: false,
      video_src: '',
    },
  ],
  featuredPrograms: {
    name: 'featuredPrograms',
    header: 'Programs.featuredPrograms',
    subtitle: '',
  },
  howItWorks: {
    name: 'howItWorks',
    header: 'Homepage.list',
    subtitle: '',
    howItWorksStages: [
      {
        icon: (<MdTouchApp size={ 60 } />),
        title: 'clientPost',
        description: 'Homepage.listItem1'
      },
      {
        icon: (<FaPeopleCarry size={ 60 } />),
        title: 'volunteerPost',
        description: 'Homepage.listItem2'
      },
      {
        icon: (<FaInbox size={ 60 } />),
        title: 'contact',
        description: 'Homepage.listItem3'
      },
      {
        icon: (<FaAward size={ 60 } />),
        title: 'review',
        description: 'Homepage.listItem4'
      },
    ],
  },
  whereWeAre: {
    name: 'whereWeAre',
    header: 'Homepage.whereWeAre',
    subtitle: ''
  },
  joinUs: {
    name: 'joinUs',
    header: 'Homepage.joinUs',
    subtitle: 'Homepage.fillOutForm'
  },
  needHelp: {
    name: 'needHelp',
    header: 'Homepage.needHelp'
  }
};

class Homepage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    // this.handleMapView = this.handleMapView.bind(this);
    this.handleUserToggle = this.handleUserToggle.bind(this);

    this.joinUsFormRef = React.createRef();

    this.state = {
      languageChecked: ENGLISH,
      signUpType: 'client',
      // mapView: 'row',
      // clientsSelected: true,
      // volunteersSelected: true,
    };
  }

  handleChange(event, stateToChange) {
    const newValue = event.currentTarget.value;
    this.setState({ [stateToChange]: newValue });
  }

  handleScroll(verticalScrollPosition) {
    window.scrollTo(0, verticalScrollPosition);
  }

  // handleMapView() {
  //   this.state.mapView === 'row'
  //   ?
  //   this.setState({ mapView: 'usa' })
  //   :
  //   this.setState({ mapView: 'row' });
  // }

  handleUserToggle(stateToChange, prevState) {
    const newState = !prevState;
    this.setState({ [stateToChange]: newState });
  }

  render() {
    return (
      <div className='homepageMainContainer'>
        <span className='splashObjects'>
          { this.renderSplash() }
          { this.renderTestimonials() }
        </span>
        { this.renderFeaturedPrograms() }
        { this.renderHowItWorks() }
        {/* { this.renderWhereWeAre() } */}
        { this.renderJoinUs() }
        { this.renderNeedHelp() }
      </div>
    );
  }

  renderTestimonials() {
    return(
      <div className='testimonialsContainer'>
        <p className='testimonialsSubtitle'>
          <FormattedMessage
            id="Testimonial.clickImage"
          />
        </p>
        <TestimonialsCarousel data={ pageContent.testimonials } />
      </div>
    );
  }

  renderSplash() {
    return(
      <div className='splashContainer'>
        <h1 className='spashHeader'>
          <FormattedMessage
            id="Homepage.subtitle"
            defaultMessage="Connect and share with our community of clients and volunteers"
          />
        </h1>
        <p>
          <FormattedMessage
            id="Homepage.subsubtitle"
          />
        </p>
        <p className='orangeText'>
          <FormattedMessage
            id="Homepage.emailOrCall"
          />
        </p>
        { this.renderContactButtons() }
        <Fab
          className='signUpButton'
          variant='extended'
          onClick={ () => { console.log(this.joinUsFormRef); this.handleScroll(this.joinUsFormRef.current.offsetTop); } }
          >
          <FormattedMessage
            id='signUp'
            defaultMessage='Sign Up'
          />
        </Fab>
      </div>
    );
  }

  renderContactButtons(size = 30) {
    const { locale } = this.props;

    return(
      <div className='homepageContact'>
        <SliderButton
          href={ 'tel:'+contactInfo.PHONE }
          clickFunction={ () => gtag_click_conversion('tel:'+contactInfo.PHONE, locale === 'en' ? opts.phone_en : opts.phone_es) }
        >
          <FaPhone
            size={ size }
            label={ (
              <FormattedMessage
                id="UserForm.phoneNumber"
                defaultMessage="Phone Number"
              />
            ) }
          />
          { contactInfo.PHONE }
        </SliderButton>
        <SliderButton
          href={ 'mailto:'+contactInfo.EMAIL }
          clickFunction={ () => gtag_click_conversion('mailto:'+contactInfo.EMAIL, locale === 'en' ? opts.email_en : opts.email_es) }
        >
          <FaEnvelope
            size={ size }
            label={ (
              <FormattedMessage
                id="UserForm.email"
                defaultMessage="Email address"
              />
            ) }
          />
          { contactInfo.EMAIL }
        </SliderButton>
      </div>
    );
  }

  renderElementContainer(content, children) {
    return(
      <div className={ content.name+'Container' }>
        <h2 className={ content.name+'Header' }>
          <FormattedMessage
            id={ content.header }
          />
        </h2>
        <p className={ content.name+'Subtitle' }>
          {
            content.subtitle &&
            (
              <FormattedMessage
                id={ content.subtitle }
              />
            )
          }
        </p>
        <div className={ content.name+'ContentContainer' }>
          { children }
        </div>
      </div>
    );
  }

  renderFeaturedPrograms() {
    return(
      this.renderElementContainer(
        pageContent.featuredPrograms,
        this.renderProgramCards(this.props.programs)
      )
    );
  }

  renderProgramCards(content) {
    const size = 40;
    let cards = [];

    content.forEach(element => {
      cards.push(
        <div key={ 'programCard'+element.id } className={ 'programCard'+element.id }>
          <Card className={ element.id+'card' }>
            <CardHeader
              avatar={
                <FaComments size={ size } />
              }
            />
            <CardContent>
              <h2 className='programCardsHeader'>
                { this.props.locale === 'es' ? element.spanish_name : element.name }
              </h2>
              <p className='programCardsText'>
                { this.props.locale === 'es' ? element.spanish_description : element.description }
              </p>
            </CardContent>
          </Card>
        </div>
      );
    });
    return cards;
  }

  renderHowItWorks() {
    return(
      this.renderElementContainer(
        pageContent.howItWorks,
        this.renderHowItWorksCards(pageContent.howItWorks.howItWorksStages)
      )
    );
  }

  renderHowItWorksCards(content) {
    let cards = [];

    content.forEach((element, index) => {
      cards.push(
        <div key={ 'programCard'+element.title } className={ 'programCard'+element.title }>
          <Card className={ element.title+'card' }>
            <CardContent>
              <span className='cardContent'>
                <span className='cardTextSpan'>
                  <span className='cardIcon'>
                    { element.icon }
                  </span>
                  <p>
                    <FormattedMessage
                      id={ element.description }
                    />
                  </p>
                </span>
                <span className='cardIndexSpan'>
                  { index+1 }
                </span>
              </span>
            </CardContent>
          </Card>
        </div>
      );
    });
    return cards;
  }
  /*
    Todo: Re-implement map for client view. 
  */ 
  // renderWhereWeAre() {
  //   return(
  //     this.renderElementContainer(
  //       pageContent.whereWeAre,
  //       this.renderWhereWeAreComponents()
  //   ));
  // }

  // renderWhereWeAreComponents() {
  //   return(
  //     <div className='whereWeAreComponentsContainer'>
  //       <FormGroup>
  //         <Grid item>
  //           <ButtonGroup
  //             variant="contained"
  //             size="large"
  //           >
  //             <Button
  //               className='userSelectClientsButton'
  //               onClick={ () => this.handleUserToggle('clientsSelected', this.state.clientsSelected) }
  //               style={ {
  //                 backgroundColor: this.state.clientsSelected ? '#F1592A' : '',
  //                 color: this.state.clientsSelected ? 'white' : '',
  //               } }
  //             >
  //               <FormattedMessage
  //                 id='HomePage.UserSelectClients'
  //                 default='Clients'
  //               />
  //             </Button>
  //             <Button
  //               className='userSelectVolunteersButton'
  //               onClick={ () => this.handleUserToggle('volunteersSelected', this.state.volunteersSelected) }
  //               style={ {
  //                 backgroundColor: this.state.volunteersSelected ? '#29AAE2' : '',
  //                 color: this.state.volunteersSelected ? 'white' : '',
  //               } }
  //             >
  //               <FormattedMessage
  //                 id='HomePage.UserSelectVolunteers'
  //                 default='Volunteers'
  //               />
  //             </Button>
  //           </ButtonGroup>
  //         </Grid>
  //         <FormControlLabel
  //           className='mapToggleLabel'
  //           control={
  //             (
  //               <Switch
  //                 checked={ this.state.mapView==='row' }
  //                 onChange={ this.handleMapView }
  //                 value={ this.state.mapView }
  //                 color='primary'
  //                 inputProps={ { 'aria-label': 'Map View Switch' } }
  //               />
  //             )
  //           }
  //           label={
  //             (
  //               this.state.mapView==='row'
  //               ?
  //               (
  //                 <p>
  //                   <FormattedMessage
  //                     id='Homepage.MapViewROW'
  //                     default='World'
  //                   />
  //                 </p>
  //               )
  //               :
  //               (
  //                 <p>
  //                   <FormattedMessage
  //                     id='Homepage.MapViewUSA'
  //                     default='USA'
  //                   />
  //                 </p>
  //               )
  //             )
  //           }
  //           labelPlacement='end'
  //         />
  //       </FormGroup>
  //       <UserMap view={ this.state.mapView } viewClients={ this.state.clientsSelected } viewVolunteers={ this.state.volunteersSelected } />
  //     </div>
  //   );
  // }

  renderJoinUs() {
    return(
      <div ref={ this.joinUsFormRef }>
        {
          this.renderElementContainer(
            pageContent.joinUs,
            this.renderJoinUsForm()
          ) }
      </div>
    );
  }

  renderJoinUsForm() {
    const { errors, changeHandler, validateHandler, locale } = this.props;
    const size = 30;
    return(
      <span className='joinUsForm'>
        <TextField
          label={ (
            <FormattedMessage
              id='UserForm.email'
              defaultMessage='Email address'
            />
          ) }
          fullWidth
          type='email'
          autoComplete='email'
          name='email'
          margin='normal'
          helperText={ errors.email }
          error={ errors.email!=null }
          onChange={ changeHandler('email') }
          onBlur={ validateHandler('email') }
        />
        <TextField
          label={ (
            <FormattedMessage
              id='UserForm.firstName'
              defaultMessage='First Name'
            />
          ) }
          fullWidth
          type='text'
          helperText={ errors.first_name }
          error={ errors.first_name!=null }
          onChange={ changeHandler('first_name') }
          onBlur={ validateHandler('first_name') }
        />
        <span className='expansionPanel'>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={ <FaCaretDown /> }>
              <p className='languageSelectorTitle'>
                <FormattedMessage
                  id='UserForm.locale'
                />
              </p>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <span className='languageButtonsContainer'>
                <Button
                  className={
                    this.state.languageChecked === ENGLISH
                    ?
                    'checked'
                    :
                    'languageButton'
                  }
                  value={ ENGLISH }
                  disabled={ this.state.languageChecked === ENGLISH }
                  disableRipple
                  onClick={  (event) => this.handleChange(event, 'languageChecked')  }
                >
                  <p>
                    English
                  </p>
                  { this.state.languageChecked === ENGLISH ? <FaCheck size={ size } /> : '' }
                </Button>
                <Button 
                  className={
                    this.state.languageChecked === SPANISH
                    ?
                    'checked'
                    :
                    'languageButton'
                  }
                  value={ SPANISH }
                  disabled={ this.state.languageChecked === SPANISH }
                  disableRipple
                  onClick={  (event) => this.handleChange(event, 'languageChecked')  }
                >
                  <p>
                    Español
                  </p>
                  { this.state.languageChecked === SPANISH ? <FaCheck size={ size } /> : '' }
                </Button>
              </span>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </span>
        <span className='radioButtons'>
          <RadioGroup
            name='signUpTypeRadio'
            onChange={ (event) => this.handleChange(event, 'signUpType') }
          >
            <FormControlLabel
              value="client"
              control={ (
                <Radio
                  icon={ <FaRegCircle className='radioButtonCircle' size={ size } /> }
                  checkedIcon={ <FaRegDotCircle className='radioButtonCheckedCircle' size={ size } /> }
                />
              ) }
              label={ <FormattedMessage id='client' /> }
              checked={ this.state.signUpType === 'client' }
            />
            <FormControlLabel
              value="volunteer"
              control={ (
                <Radio
                  icon={ <FaRegCircle className='radioButtonCircle' size={ size } /> }
                  checkedIcon={ <FaRegDotCircle className='radioButtonCheckedCircle' size={ size } /> }
                />
              ) }
              label={ <FormattedMessage id='volunteer' /> }
              checked={ this.state.signUpType === 'volunteer' }
            />
          </RadioGroup>
        </span>
        <span className='submitButtonContainer'>
          <Fab
            className='submitButton'
            variant='extended'
            component={ Link }
            disabled={ !_.isEmpty(errors) }
            to={ {
              pathname: formatLink('/sign_up/'+this.state.signUpType, this.state.languageChecked),
              state: {
                currentUser: {
                  first_name: this.props.first_name,
                  email: this.props.email
                }
              }
            } }
            onClick={ (event) => { 
              this.handleScroll(event, 0); 
              gtag_formsent_conversion(locale === 'en' ? opts.joinus_en : opts.joinus_es);
              gtag_formsent_conversion(locale === 'en' ? opts.signform_en : opts.signform_es);
            } }
            >
            <FormattedMessage
              id='Homepage.joinUsSubmit'
            />
          </Fab>
        </span>
      </span>
    );
  }

  renderNeedHelp() {
    return(
      <div className='needHelpContainer'>
        <h2 className='needHelpHeader'>
          <FormattedMessage
            id={ pageContent.needHelp.header }
          />
        </h2>
        <p className='needHelpSubtitle'>
          <FormattedMessage
            id='Homepage.askForHelp'
          />
          { ' ' }
          {
            <a href={ formatLink('/faq', this.state.languageChecked) }>
              <FormattedMessage
                id='FAQPage'
                defaultMessage='FAQ'
              />
            </a>
          }
        </p>
        <span className='needHelpLinks'>
          { this.renderContactButtons(70) }
        </span>
      </div>
    );
  }
}

Homepage.propTypes = {
  errors: PropTypes.object.isRequired,
  changeHandler: PropTypes.func.isRequired,
  validateHandler: PropTypes.func.isRequired,
  first_name: PropTypes.string,
  email: PropTypes.string,
  programs: PropTypes.array,
  locale: PropTypes.string,
};

Homepage.defaultProps = {
  first_name: '',
  email: '',
  programs: [],
  locale: 'en'
};

const validationOptions = {
  joiSchema: SignUpSchema,
};

export default validate(Homepage, validationOptions);
