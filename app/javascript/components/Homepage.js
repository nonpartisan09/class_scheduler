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
import {
  ENGLISH,
  SPANISH
} from './utils/availableLocales';
import formatLink from './utils/Link';
import SignUpSchema from './schema/SignUpSchema';
import contactInfo from '../ContactInfo';

const pageContent = {
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
        { this.renderSplash() }
        { this.renderFeaturedPrograms() }
        { this.renderHowItWorks() }
        { this.renderWhereWeAre() }
        { this.renderJoinUs() }
        { this.renderNeedHelp() }
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
  email: ''
};

const validationOptions = {
  joiSchema: SignUpSchema,
};

export default validate(Homepage, validationOptions);


