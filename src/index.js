import React, { Component } from "react";
import PropTypes from "prop-types";
import { extend } from "lodash";

export default class Fixed extends Component {
  static propTypes = {
    sticky: PropTypes.bool,
    position: PropTypes.string
  };

  static defaultProps = {
    sticky: true,
    position: "bottom"
  };

  constructor(props) {
    super(props);
    this.state = {
      scrolledPast: false,
      placeholderHeight: null
    };
  }
  componentDidMount() {
    if (this.props.sticky) {
      this.onScroll.bind(this);
      this.setState({ placeholderHeight: this.container.offsetHeight });
    }
  }
  componentWillMount() {
    if (this.props.sticky)
      window.addEventListener("scroll", this.onScroll.bind(this));
  }
  componentWillUnmount() {
    if (this.props.sticky)
      window.removeEventListener("scroll", this.onScroll.bind(this));
  }
  onScroll(e) {
    let scrollPos = document.body.scrollTop;
    let elementPos = this.placeholder.offsetTop;

    if (this.props.position === "bottom") {
      scrollPos = scrollPos + document.documentElement.clientHeight;
      elementPos = elementPos + this.container.offsetHeight;
    }

    let comparison = scrollPos > elementPos;

    if (this.props.position === "bottom") {
      comparison = scrollPos < elementPos;
    }

    if (comparison) {
      this.setState({
        scrolledPast: true
      });
    } else {
      this.setState({
        scrolledPast: false
      });
    }
  }
  render() {
    let stickyStyles;
    if (!this.props.sticky) {
      stickyStyles = {
        position: "fixed",
        left: 0
      };
      if (this.props.position === "bottom") {
        stickyStyles.bottom = 0;
      } else {
        stickyStyles.top = 0;
      }
    } else {
      if (this.state.scrolledPast) {
        stickyStyles = {
          position: "fixed",
          left: 0
        };
        if (this.props.position === "bottom") {
          stickyStyles.bottom = 0;
        } else {
          stickyStyles.top = 0;
        }
      }
    }

    const styles = _.extend({ width: "100%" }, stickyStyles, this.props.style);
    const placeholderStyles = this.props.position !== "bottom" &&
      this.state.scrolledPast
      ? { height: this.state.placeholderHeight }
      : {};

    return (
      <div>
        <div
          ref={placeholder => (this.placeholder = placeholder)}
          style={placeholderStyles}
        />
        <div
          ref={container => (this.container = container)}
          style={styles}
          className={this.props.className}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
