import React, { Component } from 'react';
import _ from 'lodash';
import {
  FaEnvelope,
  FaPhone,
  FaComments,
  FaPeopleCarry,
  FaInbox,
  FaAward,
  FaWrench,
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
  RadioGroup,
  FormControlLabel,
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

const pageContent = {
  testimonials: [
    {
      first_name: 'Jane',
      role: 'Legal Client',
      es_role: 'Spanish Role',
      location: 'L.A. California',
      quote: 'Here is some example text for Jane Here is some example text for Jane Here is some example text for Jane',
      es_quote: 'Spanish example quote',
      img_src: 'data:image/jpeg;base64,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',
      video: true,
      video_src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    },
    {
      first_name: 'Jane',
      role: 'Legal Client',
      es_role: 'Spanish Role',
      location: 'L.A. California',
      quote: 'Here is some example text for Jane',
      es_quote: 'Spanish example quote',
      img_src: 'data:image/jpeg;base64,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',
      video: false,
      video_src: '',
    },
  ],
  featuredPrograms: {
    name: 'featuredPrograms',
    header: 'Featured Programs',
    subtitle: 'Below are our featured programs!',
  },
  howItWorks: {
    name: 'howItWorks',
    header: 'How it Works',
    subtitle: 'The stages of an avarage interaction are shown below!',
    howItWorksStages: [
      {
        icon: (<MdTouchApp size={ 60 } />),
        title: 'clientPost',
        description: 'Clients post what they need help with, such as English language tutoring.'
      },
      {
        icon: (<FaPeopleCarry size={ 60 } />),
        title: 'volunteerPost',
        description: 'Volunteers post what they can help with.'
      },
      {
        icon: (<FaInbox size={ 60 } />),
        title: 'contact',
        description: 'Clients contact volunteers matching their needs and availability.'
      },
      {
        icon: (<FaAward size={ 60 } />),
        title: 'review',
        description: 'After working together, volunteers and clients review each other.'
      },
    ],
  },
  whereWeAre: {
    name: 'whereWeAre',
    header: 'Where We Are',
    subtitle: ''
  },
  joinUs: {
    name: 'joinUs',
    header: 'Join Us',
    subtitle: 'Just fill out the form below to get started!'
  },
  needHelp: {
    name: 'joinUs',
    header: 'Need Help?'
  }
};

class Homepage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.joinUsFormRef = React.createRef();

    this.state = {
      languageChecked: ENGLISH,
      signUpType: 'client',
      locale: localStorage.getItem('locale'),
    };
  }

  handleChange(event, stateToChange) {
    const newValue = event.currentTarget.value;
    this.setState({ [stateToChange]: newValue });
  }

  handleScroll(verticalScrollPosition) {
    window.scrollTo(0, verticalScrollPosition);
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
        { this.renderWhereWeAre() }
        { this.renderJoinUs() }
        { this.renderNeedHelp() }
      </div>
    );
  }

  renderTestimonials() {
    return(
      <div className='testimonialsContainer'>
        <p className='testimonialsSubtitle'>
          Click on the image below to see what our clients say
        </p>
        <TestimonialsCarousel data={ pageContent.testimonials } />
      </div>
    );
  }

  renderSplash() {
    return(
      <div className='splashContainer'>
        <h1 className='spashHeader'>
          Connect and share with our community of clients and volunteers
        </h1>
        <p>
          We&apos;re an all-volunteer team inspired by the impact of free tutoring in our local communities. We&apos;ve seen the challenges in meeting people who need our help or arranging where and when to meet. Our clients would say the same thing.
        </p>
        <p className='orangeText'>
          If you have any questions, please email or call us. We will be glad to help you!
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

    return(
      <div className='homepageContact'>
        <SliderButton
          href={ 'tel:'+contactInfo.PHONE }
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
          { content.header }
        </h2>
        <p className={ content.name+'Subtitle' }>
          { content.subtitle }
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
                { this.state.locale === 'es' ? element.spanish_name : element.name }
              </h2>
              <p className='programCardsText'>
                { this.state.locale === 'es' ? element.spanish_description : element.description }
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
                    { element.description }
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

  renderWhereWeAre() {
    const size = 60;
    return(
      this.renderElementContainer(
        pageContent.whereWeAre,
        (
          <div>
            <p>
              Content coming soon!
            </p>
            <FaWrench size={ size } />
          </div>
      ))
    );
  }

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
    const { errors, changeHandler, validateHandler } = this.props;
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
                Website & Notification Language
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
              label="Client"
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
              label="Volunteer"
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
            onClick={ (event) => { this.handleScroll(event, 0); this.handleSubmit; } }
            >
            <FormattedMessage
              id='ReviewContainer.SubmitButton'
              defaultMessage='Submit'
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
          { pageContent.needHelp.header }
        </h2>
        <p className='needHelpSubtitle'>
          Please call or send an email. Also check our
          { ' ' }
          { <Link to={ formatLink('/FAQ', this.state.languageChecked) }>FAQ</Link> }
          .
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
  programs: PropTypes.array.isRequired,
};

Homepage.defaultProps = {
  first_name: '',
  email: '',
  programs: [],
};

const validationOptions = {
  joiSchema: SignUpSchema,
};

export default validate(Homepage, validationOptions);


