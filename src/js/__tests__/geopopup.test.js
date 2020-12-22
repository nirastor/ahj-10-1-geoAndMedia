import GeoPopup from '../geopopup';

test.each([
  ['51.50851, -0.12572', '51', '50851', '-0', '12572'],
  ['51,50851,-0,12572', '51', '50851', '-0', '12572'],
  ['51/50851:-0/12572', '51', '50851', '-0', '12572'],
  ['51.50851,-0.12572', '51', '50851', '-0', '12572'],
  ['51:50851, -0:12572', '51', '50851', '-0', '12572'],
])(
  ('Should handle different separator'), (string, a, b, c, d) => {
    expect(GeoPopup.parseInput(string)[0]).toBe(a);
    expect(GeoPopup.parseInput(string)[1]).toBe(b);
    expect(GeoPopup.parseInput(string)[2]).toBe(c);
    expect(GeoPopup.parseInput(string)[3]).toBe(d);
  },
);

test('parseCheck shuould return result = false if length !==4', () => {
  const expected = false;
  const recived = GeoPopup.parseCheck([1, 2, 3]).result;

  expect(recived).toEqual(expected);
});

test('parseCheck shuould return result = false if length !==4', () => {
  const expected = false;
  const recived = GeoPopup.parseCheck([1, 2, 3, 4, 5]).result;

  expect(recived).toEqual(expected);
});

test('parseCheck shuould return result = false if latitude > 90', () => {
  const expected = false;
  const recived = GeoPopup.parseCheck(['90', '0.2', '3', '4']).result;

  expect(recived).toEqual(expected);
});

test('parseCheck shuould return result = false if latitude < 90', () => {
  const expected = false;
  const recived = GeoPopup.parseCheck(['-90', '0.2', '3', '4']).result;

  expect(recived).toEqual(expected);
});

test('parseCheck shuould return result = false if longitude > 180', () => {
  const expected = false;
  const recived = GeoPopup.parseCheck(['0', '0.2', '180', '4']).result;

  expect(recived).toEqual(expected);
});

test('parseCheck shuould return result = false if longitude < 180', () => {
  const expected = false;
  const recived = GeoPopup.parseCheck(['0', '0.2', '-181', '4']).result;

  expect(recived).toEqual(expected);
});

test('parseCheck shuould return result correct latitude', () => {
  const expected = -10.2;
  const recived = GeoPopup.parseCheck(['-10', '2', '0', '0']).latitude;

  expect(recived).toEqual(expected);
});

test('parseCheck shuould return result correct latitude', () => {
  const expected = -0.2;
  const recived = GeoPopup.parseCheck(['-0', '2', '100', '100']).latitude;

  expect(recived).toEqual(expected);
});

test('parseCheck shuould return result correct longitude', () => {
  const expected = 10.003;
  const recived = GeoPopup.parseCheck(['0', '0', '10', '003']).longitude;

  expect(recived).toEqual(expected);
});
