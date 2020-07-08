import React from "react";
import renderer from "react-test-renderer";
import ControlledStatusIndicator from "../../components/ControlledStatusIndicator";

const createTestProps = props => ({
  status: 1,
  goodIcon: "ios-medal",
  message: "Thanks for testing",
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<ControlledStatusIndicator {...props} />);
});
