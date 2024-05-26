unit Unit1;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, StdCtrls, Grids, fpjson, jsonparser;

type

  { TForm1 }

  TForm1 = class(TForm)
    ButtonLoadJSON: TButton;
    StringGridJSON: TStringGrid;
    OpenDialog1: TOpenDialog;
    procedure ButtonLoadJSONClick(Sender: TObject);
  private
    procedure LoadJSONData(const FileName: string);
    procedure AutoSizeColumns(Grid: TStringGrid);
  public

  end;

var
  Form1: TForm1;

implementation

{$R *.lfm}

{ TForm1 }

procedure TForm1.ButtonLoadJSONClick(Sender: TObject);
begin
  if OpenDialog1.Execute then
  begin
    LoadJSONData(OpenDialog1.FileName);
    AutoSizeColumns(StringGridJSON);
  end;
end;

procedure TForm1.LoadJSONData(const FileName: string);
var
  JSONData: TJSONData;
  JSONObject: TJSONObject;
  JSONParser: TJSONParser;
  JSONFile: TFileStream;
  i: Integer;
  UserObject: TJSONObject;
begin
  // Initialize the grid to a known state
  StringGridJSON.Clean;
  StringGridJSON.RowCount := 1; // Clear previous data, keep the header row
  StringGridJSON.ColCount := 5; // Email, First Name, Last Name, Email, Password
  StringGridJSON.Cells[0, 0] := 'Email';
  StringGridJSON.Cells[1, 0] := 'First Name';
  StringGridJSON.Cells[2, 0] := 'Last Name';
  StringGridJSON.Cells[3, 0] := 'Email';
  StringGridJSON.Cells[4, 0] := 'Password';

  try
    JSONFile := TFileStream.Create(FileName, fmOpenRead or fmShareDenyWrite);
    try
      JSONParser := TJSONParser.Create(JSONFile);
      try
        JSONData := JSONParser.Parse;
        try
          if JSONData.JSONType = jtObject then
          begin
            JSONObject := TJSONObject(JSONData);

            // Check if JSONObject is not empty
            if JSONObject.Count = 0 then
            begin
              ShowMessage('JSON data is empty.');
              Exit;
            end;

            StringGridJSON.RowCount := JSONObject.Count + 1; // One row for headers

            for i := 0 to JSONObject.Count - 1 do
            begin
              if (i + 1) >= StringGridJSON.RowCount then
                StringGridJSON.RowCount := i + 2;

              UserObject := JSONObject.Objects[JSONObject.Names[i]] as TJSONObject;

              StringGridJSON.Cells[0, i + 1] := JSONObject.Names[i];
              StringGridJSON.Cells[1, i + 1] := UserObject.Get('fname', '');
              StringGridJSON.Cells[2, i + 1] := UserObject.Get('lname', '');
              StringGridJSON.Cells[3, i + 1] := UserObject.Get('email', '');
              StringGridJSON.Cells[4, i + 1] := UserObject.Get('password', '');
            end;
          end
          else
          begin
            ShowMessage('JSON root is not an object.');
          end;
        finally
          JSONData.Free;
        end;
      finally
        JSONParser.Free;
      end;
    finally
      JSONFile.Free;
    end;
  except
    on E: Exception do
    begin
      ShowMessage('Error loading JSON data: ' + E.Message);
    end;
  end;
end;

procedure TForm1.AutoSizeColumns(Grid: TStringGrid);
var
  col, row: Integer;
  maxColWidth: Integer;
  cellText: string;
begin
  for col := 0 to Grid.ColCount - 1 do
  begin
    maxColWidth := Grid.Canvas.TextWidth(Grid.Cells[col, 0]);
    for row := 0 to Grid.RowCount - 1 do
    begin
      cellText := Grid.Cells[col, row];
      maxColWidth := Max(maxColWidth, Grid.Canvas.TextWidth(cellText));
    end;
    Grid.ColWidths[col] := maxColWidth + 10; // Add some padding
  end;
end;

end.

