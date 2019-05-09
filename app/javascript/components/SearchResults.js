import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { FormattedMessage } from 'react-intl';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import SearchResultItem from './SearchResultItem';
import Header from './reusable/Header';
import { HIGHEST, RECENT, CLOSEST, NEWEST } from './SortFilter';
import { getData } from './utils/sendData';
import SearchUrl from './utils/SearchUrl';
import isCurrentUserLocated from './utils/isCurrentUserLocated';

import PageHeader from './reusable/PageHeader';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);

    const { location: { state } } = props;

    this.state = {
      sortBy: RECENT,
      pageCount: state && state.page_count || 1,
      page: state && state.current_page || 1,
      volunteers: state && state.volunteers || [],
      search: state && state.search || '',
    };
  }

  componentWillMount() {
    const { location: { state } } = this.props;

    if (!state) {
      location.assign('/search');
    }
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <Header currentUser={ currentUser } />
        <div className='searchResultsContainer'>
          <PageHeader title={
            <FormattedMessage
              id='SearchResults.header'
              defaultMessage='Available Volunteers'
            />
            }
          />
          { this.renderSortDropDown() }
          <div className='searchResults'>
            { this.renderVolunteers() }
            { this.renderPagination() }
          </div>
        </div>
      </div>
    );
  }

  renderSortDropDown() {
    const { currentUser } = this.props;

    if (isCurrentUserLocated(currentUser)) {
      return (
        <div className='searchResultDropdown' >
          <DropDownMenu value={ this.state.sortBy } onClose={ this.handleBlur } onChange={ this.handleChange } >
            <MenuItem value={ RECENT } primaryText='Recently Logged In' />
            <MenuItem value={ CLOSEST } primaryText='Closest' />
            <MenuItem value={ HIGHEST } primaryText='Highest Rating' />
            <MenuItem value={ NEWEST } primaryText='Newly created' />
          </DropDownMenu>
        </div>
      );
    } else {
      return (
        <div className='searchResultDropdown' >
          <DropDownMenu value={ this.state.sortBy } onClose={ this.handleBlur } onChange={ this.handleChange } >
            <MenuItem value={ RECENT } primaryText='Recently Logged In' />
            <MenuItem value={ HIGHEST } primaryText='Highest Rating' />
            <MenuItem value={ NEWEST } primaryText='Newly created' />
          </DropDownMenu>
        </div>
      );
    }
  }

  handlePageClick({ selected }) {
    const { sortBy, search, page } = this.state;
    const { currentUser: { locale } } = this.props;

    if (page !== (selected + 1)) {
      const requestParams = {
        url: SearchUrl({ ...search, order: sortBy, page: selected + 1, locale }),

        successCallBack: ({ volunteers }) => {
          this.setState({
            volunteers,
            page: selected + 1
          });
        },

        errorCallBack: (message) => {
          this.setState({
            message: message,
          });
        }
      };

      return getData(requestParams);
    }
  }

  renderPagination() {
    const { pageCount } = this.state;

    if (pageCount > 1) {
      return (
        <div className='searchResultPaginationContainer'>
          <ReactPaginate
            previousLabel='previous'
            nextLabel='next'
            breakLabel={ <a href=''>...</a> }
            breakClassName='break-me'
            pageCount={ this.state.pageCount }
            marginPagesDisplayed={ 0 }
            pageRangeDisplayed={ 0 }
            onPageChange={ this.handlePageClick }
            containerClassName='pagination hideOnDesktop'
            activeClassName='active'
          />
          <ReactPaginate
            previousLabel='previous'
            nextLabel='next'
            breakLabel={ <a href=''>...</a> }
            breakClassName='break-me'
            pageCount={ this.state.pageCount }
            marginPagesDisplayed={ 5 }
            pageRangeDisplayed={ 5 }
            onPageChange={ this.handlePageClick }
            containerClassName='pagination hideOnMobile'
            activeClassName='active'
          />
        </div>
      );
    }
  }

  renderVolunteers() {
    const { volunteers } = this.state;

    if (volunteers) {
      const { currentUser: { locale }, currentUser, history } = this.props;
      const { search } = this.state;

      console.log(volunteers);

      return _.map(_.values(volunteers), ({ state, country, rating_count, languages, average_rating, thumbnail_image, first_name, city, current_sign_in, programs, url_slug }, key) => {
        return [
          <SearchResultItem
            locale={ locale }
            key={ key }
            search={ search }
            isCurrentUserLocated={ isCurrentUserLocated(currentUser) }
            firstName={ first_name }
            avatar={ thumbnail_image }
            lastLoggedin={ current_sign_in }
            city={ city }
            state={ state }
            country={ country }
            programs={ programs }
            urlSlug={ url_slug }
            languages={ languages }
            averageRating={ average_rating }
            ratingCount={ rating_count }
            history={ history }
            volunteers={ volunteers }
          />
        ];
      });
    }
  }

  handleChange(event, index, value) {
    this.setState({
      sortBy: value
    });
  }

  handleBlur() {
    const { sortBy, search } = this.state;
    const { currentUser: { locale } } = this.props;

    const requestParams = {
      url: SearchUrl({ ...search, order: sortBy, locale }),

      successCallBack: ({ volunteers, current_page, page_count }) => {
        this.setState({
          volunteers,
          pageCount: page_count,
          page: current_page
        });
      },

      errorCallBack: (message) => {
        this.setState({
          message: message,
        });
      }
    };

    return getData(requestParams);
  }
}

SearchResults.propTypes = {
  currentUser: PropTypes.object,
  location: PropTypes.shape({
    state: PropTypes.shape({
      volunteers: PropTypes.array,
      search: PropTypes.object
    })
  }),
  history: PropTypes.object
};

SearchResults.defaultProps = {
  currentUser: {},
  location: {
    state: {
      volunteers: [],
      search: {}
    }
  },
  history: {}
};

export default SearchResults;
