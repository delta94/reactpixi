import React, { Component } from "react";
import ReactDOM from "react-dom";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ActivityCard from "./ActivityCard";

import  {ACTIVITIES} from "../activitydata/activities.js"

class ConceptsWordProblems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
  
    return (
      <div>
        <div className="row">
        < div className="col s6">
            <ActivityCard data={ACTIVITIES.friend_sharing} />
          </div>
          < div className="col s6">
            <ActivityCard data={ACTIVITIES.more_friend_sharing} />
          </div>
        </div>
        <div className="row">
        < div className="col s6">
            <ActivityCard data={ACTIVITIES.sea_water} />
          </div>
          < div className="col s6">
            <ActivityCard data={ACTIVITIES.more_sea_water} />
          </div>
        </div>
        <div className="row">
        < div className="col s6">
            <ActivityCard data={ACTIVITIES.pizza_crust} />
          </div>
          < div className="col s6">
            <ActivityCard data={ACTIVITIES.sand_pit} />
          </div>
        </div>
        <div className="row">
        < div className="col s6">
            <ActivityCard data={ACTIVITIES.snow_plow} />
          </div>
        </div>
      </div>
    );
  }
}

export default ConceptsWordProblems;
