import React from "react";
import renderer from "react-test-renderer";
import EnableLocationModal from "../../components/EnableLocationModal";

const createTestProps = props => ({
  modalVisible: true,
  hideModal: jest.fn(),
  ...props
});

test("Should render", () => {
  const props = createTestProps({});
  const rendered = renderer.create(<EnableLocationModal {...props} />);
  expect(rendered).toBeTruthy();
});
