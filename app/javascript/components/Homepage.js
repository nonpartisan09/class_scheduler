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
import CardCarousel from './TestimonialsCarousel';
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
      location: 'L.A. California',
      quote: 'Here is some example text for Jane',
      img_src: 'data:image/jpeg;base64,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',
      video_src: '',
    },
    {
      first_name: 'Maria',
      role: 'Legal Client',
      location: 'Mexico',
      quote: 'Here is some example text for Maria',
      img_src: 'data:image/jpeg;base64,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',
      video_src: '',
    },
    {
      first_name: 'Sophie',
      role: 'Legal Client',
      location: 'London',
      quote: 'Here is some example text for Sophie',
      img_src: 'data:image/jpeg;base64,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',
      video_src: '',
    }
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
        <CardCarousel data={ pageContent.testimonials } />
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


